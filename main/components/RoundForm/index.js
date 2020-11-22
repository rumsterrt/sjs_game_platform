import React, { useState } from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Text, Select, Form, Button } from 'components/Antd'
import { INPUT_TYPES } from 'main/constants'
import './index.styl'

const RoundForm = ({ gameGroupId }) => {
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
  }

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
  console.log('asdasd', { template, game, currentRound, gameGroup })
  const questions = template.questions || []
  const { submit } = (currentRound && currentRound.answers[user.id]) || { response: [], submit: false }

  return pug`
    if !submit
      Form.root(
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
