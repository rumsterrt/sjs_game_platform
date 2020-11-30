import React, { useState, useEffect } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Text, Select, Form, Button } from 'components/Antd'
import { H4 } from '@startupjs/ui'
import { INPUT_TYPES } from 'main/constants'
import _get from 'lodash/get'
import './index.styl'

const RoundForm = ({ gameGroupId }) => {
  const [form] = Form.useForm()
  const [user = {}] = useSession('user')
  const [gameGroup = {}, $gameGroup] = useDoc('gameGroups', gameGroupId)
  const [game = {}, $game] = useDoc('games', gameGroup.gameId)

  const [template = {}] = useDoc('templates', game.templateId)

  const [currentRound, setCurrentRound] = useState()

  const getCurrentRound = async () => {
    if (!gameGroup) {
      return
    }
    setCurrentRound(await $gameGroup.getCurrentRound())
    form.resetFields()
  }

  useEffect(getCurrentRound, [gameGroup.currentRound])

  if (!game || !gameGroup) {
    return pug`
      Text You aren't in this game
    `
  }

  const renderField = (key, { inputType, message, role, inputSettings }) => {
    switch (inputType) {
      case INPUT_TYPES.TextInput:
        return pug`
          Form.Item(key=message name=key label=message rules=[{required: true}])
            Input
        `
      case INPUT_TYPES.NumberInput:
        return pug`
          Form.Item(key=message name=key label=message rules=[{required: true}])
            InputNumber(min=inputSettings.min max=inputSettings.max)
        `
      case INPUT_TYPES.Selector:
        return pug`
          Form.Item(key=message name=key label=message rules=[{required: true}])
            Select(options=inputSettings.options.map(item => ({label: item, value: item})))
        `
    }
  }

  const onFinish = async ({ questions }) => {
    await $game.responseByPlayer(user.id, questions)
    await getCurrentRound()
  }

  const handleBackToEdit = async () => {}

  const questions = template.questions || []
  const { submit } = (currentRound && currentRound.answers[user.id]) || { response: [], submit: false }
  const roundIndex = _get(currentRound, 'roundIndex', 0) + 1
  console.log('roundIndex', { roundIndex, currentRound })

  return pug`
    H4 Round #{roundIndex}
    if !submit
      Form.root(
        form=form
        name='RoundForm'
        onFinish=onFinish
        layout="vertical"
      )
        each question, index in questions
          = renderField(['questions',index], question)
        Button(type='primary' htmlType="submit") Next
    else
      Button(type='secondary' onClick=handleBackToEdit) Cancel
  `
}

export default observer(RoundForm)
