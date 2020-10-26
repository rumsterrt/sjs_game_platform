import React from 'react'
import { TextInput, Button, Checkbox, Span, Div, Br } from '@startupjs/ui'
import { useLoader, Logo } from 'components'
import { observer, emit, useSession, useValue } from 'startupjs'
import { Input, InputNumber, Text, Select } from 'components/Antd'
import QuestionsInput from './components/QuestionsInput'
import axios from 'axios'
import './index.styl'

const TemplateForm = ({ initValues = {}, isLocked }) => {
  const [scope, $scope] = useValue({
    name: '',
    description: '',
    rounds: 1,
    roles: [],
    questions: [],
    ...initValues
  })

  const onSubmit = async () => {}

  return pug`
    Div.root
      Input(value=scope.name name='name' label='Name' placeholder='Enter name' onChange=e=>$scope.set('name', e.target.value) disabled=isLocked)
      Br
      Input.TextArea(value=scope.description name='description' label='Description' placeholder='Enter description' onChange=e=>$scope.set('description', e.target.value) disabled=isLocked)
      Br
      InputNumber(value=scope.rounds name='rounds' label='Rounds' placeholder='Enter number of rounds' onChange=value=>$scope.set('rounds', value) type='number' disabled=isLocked)
      Br
      Select(mode='tags' placeholder='Input players roles' value=scope.roles onChange=value=>$scope.set('roles', value))
      Br
      QuestionsInput(value=scope.questions roles=scope.roles.map(item => ({label: item, value: item})) placeholder='Enter number of rounds' onChange=value=>$scope.set('questions', value) disabled=isLocked)
      Br
      Button(type='primary' onClick=onSubmit) Enter
  `
}

export default observer(TemplateForm)
