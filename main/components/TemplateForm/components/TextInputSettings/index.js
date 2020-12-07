import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { Input, InputNumber, Form, Col, Row } from 'components/Antd'
import TemplateCheckbox from '../TemplateCheckbox'
import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'
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
    const newValue = { ...value }
    _update(newValue, path, () => fieldValue || null)
    onChange(newValue)
  }

  return pug`
    Card
      Form.Item(label="Length")
        Col
          if addTemplateField
            Row
              TemplateCheckbox(value=_get(value,'length.isTemplate') onChange=fieldValue=>handleChange('length.isTemplate', fieldValue) name='lengthTemplate' disabled=disabled)
          Row
            if !_get(value,'length.isTemplate')
              InputNumber(value=_get(value,'length.value') name='lengthValue' min=1 placeholder='Enter length' onChange=fieldValue=>handleChange('length.value', fieldValue) disabled=disabled style={width: '100%'})
            else
              Input(value=_get(value,'length.value') name='lengthValue' placeholder='Enter length template' onChange=e=>handleChange('length.value', e.target.value) disabled=disabled)
      Form.Item(label="Regular expression")
        Col
          if addTemplateField
            Row
              TemplateCheckbox(value=_get(value,'regex.isTemplate') onChange=fieldValue=>handleChange('regex.isTemplate', fieldValue) name='regexTemplate' disabled=disabled)
          Row
            Input(value=_get(value,'regex.value') name='regexValue' placeholder='Enter regex' onChange=e=>handleChange('regex.value', e.target.value) disabled=disabled)
  `
}

export default TextInputSettings
