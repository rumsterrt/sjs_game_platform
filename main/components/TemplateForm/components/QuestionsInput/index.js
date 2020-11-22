import React, { useEffect } from 'react'
import { Button } from '@startupjs/ui'
import { observer } from 'startupjs'
import { Input, Select, Form, Collapse } from 'components/Antd'
import _update from 'lodash/update'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import NumberInputSettings from '../NumberInputSettings'
import SelectInputSettings from '../SelectInputSettings'
import TextInputSettings from '../TextInputSettings'

import { INPUT_TYPES } from 'main/constants'

import './index.styl'

const inputSettingsRenderMap = {
  [INPUT_TYPES.TextInput]: TextInputSettings,
  [INPUT_TYPES.NumberInput]: NumberInputSettings,
  [INPUT_TYPES.Selector]: SelectInputSettings
}

const defaultQuestion = {
  role: [],
  inputType: INPUT_TYPES.TextInput,
  inputSettings: {}
}

const QuestionsInput = ({ value = [], onChange, disabled, roles }) => {
  useEffect(() => {
    if (!value || value.length === 0) {
      onChange([{ ...defaultQuestion }])
    }
  }, [])
  const onAdd = () => {
    onChange([...value, { ...defaultQuestion }])
  }

  const onRemove = (index) => () => {
    onChange(value.filter((item, itemIndex) => itemIndex !== index))
  }

  const onChangeItem = (index, path, fieldValue) => {
    const newValue = [...value]
    _update(newValue[index], path, () => fieldValue)
    onChange(newValue)
  }

  const renderInputSettings = (index, item, value) => {
    const SettingsRender = inputSettingsRenderMap[item.inputType]
    return pug`
      if SettingsRender
        SettingsRender(value=item.inputSettings onChange=value=>onChangeItem(index, 'inputSettings', value) disabled=disabled)
    `
  }

  const getPanelExtra = (index) => {
    return pug`
      if value.length > 1
        Button(variant='text' onClick=onRemove(index) icon=faTrash disabled=disabled)
    `
  }

  return pug`
    Collapse.root
      each item, index in value
        Collapse.Panel(key=index header="Question " + (index + 1) extra=getPanelExtra(index))
          Form.Item(label="Roles")
            Select(mode="multiple" placeholder='Select roles' options=roles value=item.role onChange=value=>onChangeItem(index, 'role', value) disabled=disabled)
          Form.Item(label="Message")
            Input.TextArea(value=item.message name='message' placeholder='Enter message' onChange=e=>onChangeItem(index, 'message', e.target.value) disabled=disabled)
          Form.Item(label="Input type")
            Select(placeholder='Select Input type' options=Object.keys(INPUT_TYPES).map(item=>({label:item, value: item})) value=item.inputType onChange=value=>onChangeItem(index, 'inputType', value) disabled=disabled)
          Form.Item(label="Input settings")
            = renderInputSettings(index, item, value)
    Button(variant='text' onClick=onAdd icon=faPlus disabled=disabled)
  `
}

export default observer(QuestionsInput)
