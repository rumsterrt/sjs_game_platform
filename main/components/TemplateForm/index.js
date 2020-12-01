import React, { useState, useEffect } from 'react'
import { observer, useQuery, model, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Select, Form, Button, Checkbox, notification } from 'components/Antd'
import QuestionsInput from './components/QuestionsInput'

import './index.styl'

const defaultInit = {
  name: '',
  description: '',
  rounds: 1,
  roles: [],
  questions: []
}

const TemplateForm = ({ templateId, onSubmit }) => {
  const [user = {}] = useSession('user')
  const [localValues, setLocalValues] = useState({})
  const [template = {}] = useDoc('templates', templateId)
  const [, $templates] = useQuery('templates')

  useEffect(() => {
    setLocalValues(template || defaultInit)
  }, [JSON.stringify(template)])

  const onFinish = async (values) => {
    if (templateId) {
      $templates.at(templateId).setEach({
        ...values
      })
    } else {
      $templates.add({
        id: templateId || model.id(),
        teacherId: user.id,
        ...values
      })
    }
    notification.info({
      message: templateId ? 'Template was updated' : 'Template was created'
    })
    onSubmit && onSubmit()
  }
  const onValuesChange = (values) => setLocalValues({ ...localValues, ...values })

  const isLocked = templateId && user.id !== template.teacherId
  console.log('template', { template })
  return pug`
    Form.root(
      name='TemplateSettings'
      initialValues=template
      onFinish=onFinish
      onValuesChange=onValuesChange
      layout="vertical"
    )
      Form.Item(name='name' label="Name" rules=[{required: true, }])
        Input(placeholder='Enter name' disabled=isLocked)
      Form.Item(name='description' label="Description" rules=[{required: true }])
        Input.TextArea(placeholder='Enter description' disabled=isLocked)
      Form.Item(name='rounds' label="Rounds" rules=[{required: true }])
        InputNumber(min=1 placeholder='Enter number of rounds' type='number' disabled=isLocked)
      Form.Item(name='roles' label="Roles" rules=[{required: true, }])
        Select(mode='tags' placeholder='Input players roles' disabled=isLocked)
      Form.Item(name='hasCommon' valuePropName="checked")
        Checkbox(disabled=isLocked) Has common questions
      if localValues.hasCommon
        Form.Item(name='commonQuestions' label="Common Questions")
          QuestionsInput(disabled=isLocked emptyByDefault common)
      Form.Item(name='questions' label="Questions")
        QuestionsInput(disabled=isLocked roles=(localValues.roles || []).map(item => ({label: item, value: item})))
      Form.Item(name='scoreCalc' label="Score calculation template")
        Input.TextArea(placeholder='Enter score rules' disabled=isLocked)
      if !isLocked
        Button(type='primary' htmlType="submit") Save
  `
}

export default observer(TemplateForm)
