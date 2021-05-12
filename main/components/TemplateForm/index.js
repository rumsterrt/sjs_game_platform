import React, { useState, useEffect } from 'react'
import { Button } from '@startupjs/ui'
import { observer, useQuery, model, useSession, useDoc } from 'startupjs'
import QuestionsInput from './components/QuestionsInput'
import { Notification } from 'components'
import { FormItem, Form, Input, Checkbox, InputNumber, ArrayInput, useForm } from 'components/Form'

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
  const [form] = useForm({ initValue: template })
  const [, $templates] = useQuery('templates')
  useEffect(() => {
    setLocalValues(template || defaultInit)
  }, [JSON.stringify(template)])

  const handleSubmit = () => {
    try {
      const values = form.validateFields()
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
      Notification.addNotify({
        message: templateId ? 'Template was updated' : 'Template was created'
      })
      onSubmit && onSubmit()
    } catch (err) {
      Notification.addNotify({ type: 'error', message: err.message })
    }
  }

  const onValuesChange = (values) => setLocalValues({ ...localValues, ...values })

  const isLocked = templateId && user.id !== template.teacherId

  return pug`
    Form.root(
      form=form
      onValuesChange=onValuesChange
    )
      FormItem(name='name' label="Name" rules=[{required: true, }])
        Input(placeholder='Enter name' disabled=isLocked)
      FormItem(name='description' label="Description" rules=[{required: true }])
        Input(
          placeholder='Enter description'
          disabled=isLocked
          multiline
          resize
          numberOfLines=4
        )
      FormItem(name='rounds' label="Rounds" rules=[{required: true }])
        InputNumber(min=1 placeholder='Enter number of rounds' type='number' disabled=isLocked)
      FormItem(name='roles' label="Roles" rules=[{required: true, }])
        ArrayInput(items={
          input: 'text'
        } placeholder='Input players roles' disabled=isLocked)
      FormItem(name='hasCommon' valuePropName="checked")
        Checkbox(disabled=isLocked) Has common questions
      if localValues.hasCommon
        FormItem(name='commonQuestions' label="Common Questions")
          QuestionsInput(disabled=isLocked emptyByDefault common)
      FormItem(name='questions' label="Questions")
        QuestionsInput(disabled=isLocked roles=(localValues.roles || []).map(item => ({label: item, value: item})))
      FormItem(name='scoreCalc' label="Score calculation template")
        Input(
          placeholder='Enter score rules'
          disabled=isLocked
          multiline
          resize
          numberOfLines=4
        )
      if !isLocked
        Button(onPress=handleSubmit) Save
  `
}

export default observer(TemplateForm)
