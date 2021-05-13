import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { Input, InputNumber, FormItem } from 'components/Form'
import TemplateCheckbox from '../TemplateCheckbox'
import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import _get from 'lodash/get'

const defaultValue = {
  length: { value: null, isTemplate: false },
  regex: { value: null, isTemplate: false }
}

const TextInputSettings = ({ value = {}, onChange, disabled, addTemplateField }) => {
  useEffect(() => {
    if (_isEmpty(value)) {
      onChange(defaultValue)
    }
  }, [])

  const handleChange = (path, fieldValue) => {
    const newValue = _cloneDeep(value)
    _update(newValue, path, () => fieldValue || null)
    onChange(newValue)
  }

  return pug`
    Card
      FormItem(label="Length")
        if addTemplateField
          TemplateCheckbox(value=_get(value,'length.isTemplate') onChange=fieldValue=>handleChange('length.isTemplate', fieldValue) name='lengthTemplate' disabled=disabled)
          if !_get(value,'length.isTemplate')
            InputNumber(value=_get(value,'length.value') name='lengthValue' min=1 placeholder='Enter length' onChange=fieldValue=>handleChange('length.value', fieldValue) disabled=disabled style={width: '100%'})
          else
            Input(value=_get(value,'length.value') name='lengthValue' placeholder='Enter length template' onChange=val=>handleChange('length.value', val) disabled=disabled)
      FormItem(label="Regular expression")
        if addTemplateField
          TemplateCheckbox(value=_get(value,'regex.isTemplate') onChange=fieldValue=>handleChange('regex.isTemplate', fieldValue) name='regexTemplate' disabled=disabled)
        Input(value=_get(value,'regex.value') name='regexValue' placeholder='Enter regex' onChange=val=>handleChange('regex.value', val) disabled=disabled)
  `
}

export default TextInputSettings
