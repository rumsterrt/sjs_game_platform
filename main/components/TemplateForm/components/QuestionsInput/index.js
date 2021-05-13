import React, { useEffect } from 'react'
import { Button, Collapse, Div, Span } from '@startupjs/ui'
import { observer, useValue } from 'startupjs'
import { FormItem, Input, Select } from 'components/Form'
import _update from 'lodash/update'
import _cloneDeep from 'lodash/cloneDeep'
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

const QuestionsInput = ({ value = [], onChange, disabled, roles, common, emptyByDefault }) => {
  const [openKeys, $openKeys] = useValue({})
  useEffect(() => {
    if (emptyByDefault) {
      return
    }
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
    const newValue = _cloneDeep(value)
    _update(newValue[index], path, () => fieldValue)
    onChange(newValue)
  }

  const renderInputSettings = (index, item, value, canBeTemplate) => {
    const SettingsRender = inputSettingsRenderMap[item.inputType]
    return pug`
      if SettingsRender
        SettingsRender(value=item.inputSettings onChange=value=>onChangeItem(index, 'inputSettings', value) disabled=disabled addTemplateField=canBeTemplate)
    `
  }

  return pug`
    Div.root
      each item, index in value
        Collapse(key=index open=openKeys[index] onChange=() => $openKeys.setEach({[index]: !openKeys[index]}))
          Collapse.Header.header(iconPosition='right')
            Div.headerContent
              Span #{"Question " + (index + 1)}
              if value.length > 1
                Button(variant='text' onPress=onRemove(index) icon=faTrash disabled=disabled)
          Collapse.Content
            if !common
              FormItem(label="Roles")
                Select(mode="multiple" placeholder='Select roles' options=roles value=item.role onChange=value=>onChangeItem(index, 'role', value) disabled=disabled)
            FormItem(label="Message")
              Input(value=item.message name='message' placeholder='Enter message' onChange=val=>onChangeItem(index, 'message', val) disabled=disabled multiline
              resize
              numberOfLines=4)
            FormItem(label="Input type")
              Select(placeholder='Select Input type' options=Object.keys(INPUT_TYPES).map(item=>({label:item, value: item})) value=item.inputType onChange=value=>onChangeItem(index, 'inputType', value) disabled=disabled)
            FormItem(label="Input settings")
              = renderInputSettings(index, item, value, !common)
    Button(variant='text' onPress=onAdd icon=faPlus disabled=disabled)
  `
}

export default observer(QuestionsInput)
