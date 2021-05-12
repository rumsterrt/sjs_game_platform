import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { InputNumber, FormItem, Input } from 'components/Form'
import TemplateCheckbox from '../TemplateCheckbox'
import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'

import _cloneDeep from 'lodash/cloneDeep'
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
    const newValue = _cloneDeep(value)
    _update(newValue, path, () => fieldValue)
    onChange(newValue)
  }

  return pug`
    Card
      FormItem(label="Minimum limit")
        if addTemplateField
          TemplateCheckbox(value=_get(value,'min.isTemplate') onChange=fieldValue=>handleChange('min.isTemplate', fieldValue) name='minTemplate' disabled=disabled)
          if !_get(value,'min.isTemplate')
            InputNumber(value=_get(value,'min.value') name='minValue' placeholder='Enter min value' onChange=fieldValue=>handleChange('min.value', fieldValue) disabled=disabled style={width: '100%'})
          else
            Input(value=_get(value,'min.value') name='minValue' placeholder='Enter min template' onChange=val=>handleChange('min.value', val) disabled=disabled)
      FormItem(label="Maximum limit")
        if addTemplateField
          TemplateCheckbox(value=_get(value,'max.isTemplate') onChange=fieldValue=>handleChange('max.isTemplate', fieldValue) name='maxTemplate' disabled=disabled)
          if !_get(value,'max.isTemplate')
            InputNumber(value=_get(value,'max.value') name='maxValue' placeholder='Enter max value' onChange=fieldValue=>handleChange('max.value', fieldValue) disabled=disabled style={width: '100%'})
          else
            Input(value=_get(value,'max.value') name='maxValue' placeholder='Enter max template' onChange=val=>handleChange('max.value', val) disabled=disabled)
  `
}

export default NumberInputSettings
