import React, { useState, useEffect } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Text, Select, Form, Button } from 'components/Antd'
import { H4 } from '@startupjs/ui'
import { INPUT_TYPES } from 'main/constants'
import _get from 'lodash/get'
import './index.styl'
import { notification } from 'antd'

const RoundForm = ({ gameGroupId, common }) => {
  const [form] = Form.useForm()
  const [user = {}] = useSession('user')
  const [gameGroup = {}, $gameGroup] = useDoc('gameGroups', gameGroupId)
  const [game = {}, $game] = useDoc('games', gameGroup.gameId)

  const [template = {}] = useDoc('templates', game.templateId)

  const [currentRoundId, setCurrentRoundId] = useState()
  const [currentRound] = useDoc('rounds', currentRoundId)
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState([])

  const getCurrentRound = async () => {
    if (!gameGroup) {
      return
    }
    const round = await $gameGroup.getCurrentRound()
    setCurrentRoundId(round.id)
    form.resetFields()
  }

  useEffect(getCurrentRound, [gameGroup.currentRound])

  useEffect(() => {
    const newAnswers = common
      ? {
          response: _get(currentRound, 'commonAnswers.response', []),
          submit: _get(currentRound, 'commonAnswers.submit', []).includes(user.id)
        }
      : _get(currentRound, `answers.${user.id}`) || { response: [], submit: false }
    setAnswers(newAnswers)
    const userRole = _get(gameGroup, `players.${user.id}`)
    setQuestions(common ? template.commonQuestions : template.questions.filter((item) => item.role.includes(userRole)))
    form.setFieldsValue({ answers: newAnswers.response })
  }, [JSON.stringify(currentRound)])

  if (!game || !gameGroup) {
    return pug`
      Text You aren't in this game
    `
  }

  const renderField = (key, { inputType, message, role, inputSettings }, initialValue) => {
    const rules = [{ required: true, message: 'Value is required!' }]

    switch (inputType) {
      case INPUT_TYPES.TextInput:
        if (inputSettings.regex) {
          console.log('regex', new RegExp(inputSettings.regex, 'g'))
          rules.push({
            pattern: new RegExp(inputSettings.regex, 'g'),
            message: `Value must be relative to this pattern "${inputSettings.regex}"`
          })
        }
        if (inputSettings.length) {
          rules.push({ len: inputSettings.length, message: `Value length must be equal ${inputSettings.length}` })
        }
        return pug`
          Form.Item(key=key name=key label=message rules=rules initialValue=initialValue)
            Input
        `
      case INPUT_TYPES.NumberInput:
        if (inputSettings.max) {
          rules.push({
            type: 'number',
            max: inputSettings.max,
            message: `Value must be less or equal ${inputSettings.max}`
          })
        }
        if (inputSettings.max) {
          rules.push({
            type: 'number',
            min: inputSettings.min,
            message: `Value must be greater or equal ${inputSettings.min}`
          })
        }
        return pug`
          Form.Item(key=key name=key label=message rules=rules)
            InputNumber(min=inputSettings.min max=inputSettings.max)
        `
      case INPUT_TYPES.Selector:
        return pug`
          Form.Item(key=key name=key label=message rules=rules)
            Select(options=inputSettings.options.map(item => ({label: item, value: item})))
        `
    }
  }

  const onFinish = async ({ answers: formAnswers }) => {
    await $game.responseByPlayer(user.id, formAnswers, common)
    await getCurrentRound()
  }

  const onFinishFailed = (errorInfo) => {
    console.log('onFinishFailed', errorInfo)
    notification.error({ message: 'Check fields errors!' })
  }

  const handleBackToEdit = async () => {}

  const roundIndex = _get(currentRound, 'roundIndex', 0) + 1

  return pug`
    H4 Round #{roundIndex}
    if !answers.submit
      Form.root(
        form=form
        name='RoundForm'
        onFinish=onFinish
        onFinishFailed=onFinishFailed
        layout="vertical"
      )
        each question, index in questions
          = renderField(['answers',index], question)
        Button(type='primary' htmlType="submit") Next
    else
      Button(type='secondary' onClick=handleBackToEdit) Cancel
  `
}

export default observer(RoundForm)
