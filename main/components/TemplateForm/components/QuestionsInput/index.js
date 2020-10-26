import React from 'react'
import { TextInput, Button, Checkbox, Span, Div, Br, Card } from '@startupjs/ui'
import { useLoader, Logo } from 'components'
import { observer, emit, useSession, useValue } from 'startupjs'
import { Input, InputNumber, Text, Select } from 'components/Antd'
import axios from 'axios'
import './index.styl'

const defaultQuestion = {
  role: [],
  input: 'default',
  validateTemplate: ''
}

const QuestionsInput = ({ value = [], onChange, disabled, roles }) => {
  const [items, $items] = useValue(value.length > 0 ? value : [defaultQuestion])

  const onAdd = () => {
    $items.set([...items, defaultQuestion])
  }

  const onRemove = (index) => () => {
    $items.set(items.filter((item, itemIndex) => itemIndex === index))
  }

  return pug`
    Div.root
      each item, index in items
        Card
          if items.length > 1
            Button( onClick=onRemove(index) disabled=disabled) Remove
          Select(mode="multiple" placeholder='Select roles' options=roles value=item.role onChange=value=>$items.set(index+'.role', value) disabled=disabled)
          Br
          Select(placeholder='Select Input type' value=item.role onChange=value=>$items.set(index+'.input', value) disabled=disabled)
          Br
          Input.TextArea(value=item.validateTemplate name='valRule' placeholder='Enter validate rule' onChange=e=>$items.set(index + '.validateTemplate', e.target.value) disabled=disabled)
      Button( onClick=onAdd disabled=disabled) Add question
  `
}

export default observer(QuestionsInput)
