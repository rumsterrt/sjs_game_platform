import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { InputNumber, Form, Row, Col, Input } from 'components/Antd'
import TemplateCheckbox from '../TemplateCheckbox'
import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

const defaultValue = {
  min: { value: null, isTemplate: false },
  max: { value: null, isTemplate: false }
}

const NumberInputSettings = ({ value = {}, onChange, disabled, addTemplateField }) => {
  useEffect(() => {
    if (_isEmpty(value)) {
      onChange(defaultValue)
    }
  }, [])

  const handleChange = (path, fieldValue) => {
    const newValue = { ...value }
    _update(newValue, path, () => fieldValue)
    onChange(newValue)
  }

  return pug`
    Card
      Form.Item(label="Minimum limit")
        Col
          if addTemplateField
            Row
              TemplateCheckbox(value=_get(value,'min.isTemplate') onChange=fieldValue=>handleChange('min.isTemplate', fieldValue) name='minTemplate' disabled=disabled)
          Row
            if !_get(value,'min.isTemplate')
              InputNumber(value=_get(value,'min.value') name='minValue' placeholder='Enter min value' onChange=fieldValue=>handleChange('min.value', fieldValue) disabled=disabled style={width: '100%'})
            else
              Input(value=_get(value,'min.value') name='minValue' placeholder='Enter min template' onChange=e=>handleChange('min.value', e.target.value) disabled=disabled)
      Form.Item(label="Maximum limit")
        Col
          if addTemplateField
            Row
              TemplateCheckbox(value=_get(value,'max.isTemplate') onChange=fieldValue=>handleChange('max.isTemplate', fieldValue) name='maxTemplate' disabled=disabled)
          Row
            if !_get(value,'max.isTemplate')
              InputNumber(value=_get(value,'max.value') name='maxValue' placeholder='Enter max value' onChange=fieldValue=>handleChange('max.value', fieldValue) disabled=disabled style={width: '100%'})
            else
              Input(value=_get(value,'max.value') name='maxValue' placeholder='Enter max template' onChange=e=>handleChange('max.value', e.target.value) disabled=disabled)
  `
}

export default NumberInputSettings
