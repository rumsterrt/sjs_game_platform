import React, { useState, useEffect } from 'react'
import { observer, useQuery, model, useSession, useDoc } from 'startupjs'
import { Input, InputNumber, Select, Form, Button, notification } from 'components/Antd'
import QuestionsInput from './components/QuestionsInput'

import './index.styl'

const defaultInit = {
  name: '',
  description: '',
  rounds: 1,
  roles: [],
  questions: []
}

const TemplateForm = ({ templateId }) => {
  const [user = {}] = useSession('user')
  const [localValues, setLocalValues] = useState({})
  const [template = {}] = useDoc('templates', templateId)
  const [, $templates] = useQuery('templates')

  useEffect(() => {
    setLocalValues(template || defaultInit)
  }, [JSON.stringify(template)])

  const onFinish = async (values) => {
    console.log('values', values)
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
  }
  const onValuesChange = (values) => setLocalValues({ ...localValues, ...values })

  const isLocked = templateId && user.id !== template.teacherId

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
      Form.Item(name='questions' label="Questions")
        QuestionsInput(disabled=isLocked roles=(localValues.roles || []).map(item => ({label: item, value: item})))
      Form.Item(name='scoreCalc' label="Score calculation template")
        Input.TextArea(placeholder='Enter score rules' disabled=isLocked)
      if !isLocked
        Button(type='primary' htmlType="submit") Save
  `
}

export default observer(TemplateForm)
