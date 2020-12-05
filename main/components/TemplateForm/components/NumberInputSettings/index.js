import React from 'react'
import { Card } from '@startupjs/ui'
import { InputNumber, Form } from 'components/Antd'
import _update from 'lodash/update'

const NumberInputSettings = ({ value = {}, onChange, disabled }) => {
  const handleChange = (path, fieldValue) => {
    const newValue = { ...value }
    _update(newValue, path, () => fieldValue || null)
    onChange(newValue)
  }

  return pug`
    Card
      Form.Item(label="Minimum limit")
        InputNumber(value=value.min name='min' max=value.max placeholder='Enter min value' onChange=e=>handleChange('min', e) disabled=disabled)
      Form.Item(label="Maximum limit")
        InputNumber(value=value.max name='max' min=value.min placeholder='Enter max value' onChange=e=>handleChange('max', e) disabled=disabled)
  `
}

export default NumberInputSettings
