import React, { useState, useEffect } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Text, Select, Form, Button } from 'components/Antd'
import { H4 } from '@startupjs/ui'
import { INPUT_TYPES } from 'main/constants'
import _get from 'lodash/get'
import './index.styl'

const RoundForm = ({ gameGroupId, common }) => {
  const [form] = Form.useForm()
  const [user = {}] = useSession('user')
  const [gameGroup = {}, $gameGroup] = useDoc('gameGroups', gameGroupId)
  const [game = {}, $game] = useDoc('games', gameGroup.gameId)

  const [template = {}] = useDoc('templates', game.templateId)

  const [currentRound, setCurrentRound] = useState()
  const [answers, setAnswers] = useState({})
  const [questions, setQuestions] = useState([])
  console.log('currentRound', { currentRound, answers })

  const getCurrentRound = async () => {
    if (!gameGroup) {
      return
    }
    const round = await $gameGroup.getCurrentRound()
    setCurrentRound(round)
    form.resetFields()
  }

  useEffect(getCurrentRound, [gameGroup.currentRound])

  useEffect(() => {
    setAnswers(
      common
        ? {
            response: _get(currentRound, 'commonAnswers.response', []),
            submit: _get(currentRound, 'commonAnswers.submit', []).includes(user.id)
          }
        : _get(currentRound, `answers.${user.id}`) || { response: [], submit: false }
    )
    const userRole = _get(gameGroup, `players.${user.id}`)
    setQuestions(common ? template.commonQuestions : template.questions.filter((item) => item.role.includes(userRole)))
  }, [JSON.stringify(currentRound)])

  if (!game || !gameGroup) {
    return pug`
      Text You aren't in this game
    `
  }

  const renderField = (key, { inputType, message, role, inputSettings }, initialValue) => {
    switch (inputType) {
      case INPUT_TYPES.TextInput:
        return pug`
          Form.Item(key=key name=key label=message rules=[{required: true, message: 'Value is required!'}] initialValue=initialValue)
            Input
        `
      case INPUT_TYPES.NumberInput:
        return pug`
          Form.Item(key=key name=key label=message rules=[{required: true, message: 'Value is required!'}])
            InputNumber(min=inputSettings.min max=inputSettings.max)
        `
      case INPUT_TYPES.Selector:
        return pug`
          Form.Item(key=key name=key label=message rules=[{required: true, message: 'Value is required!'}])
            Select(options=inputSettings.options.map(item => ({label: item, value: item})))
        `
    }
  }

  const onFinish = async ({ answers: formAnswers }) => {
    await $game.responseByPlayer(user.id, formAnswers, common)
    await getCurrentRound()
  }

  const handleBackToEdit = async () => {}

  const roundIndex = _get(currentRound, 'roundIndex', 0) + 1
  const initialValues = { answers: answers.response }
  console.log('initialValues', { initialValues })
  return pug`
    H4 Round #{roundIndex}
    if !answers.submit
      Form.root(
        form=form
        initialValues=initialValues
        name='RoundForm'
        onFinish=onFinish
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
