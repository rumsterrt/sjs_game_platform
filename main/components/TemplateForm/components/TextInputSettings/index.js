import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { Input, InputNumber, Form } from 'components/Antd'
import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'

const defaultValue = {
  length: null,
  regex: null
}

const TextInputSettings = ({ value = {}, onChange, disabled }) => {
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
        InputNumber(value=value.length name='length' min=1 placeholder='Enter length' onChange=fieldValue=>handleChange('length', fieldValue) disabled=disabled)
      Form.Item(label="Regular expression")
        Input(value=value.regex name='regex' placeholder='Enter regex' onChange=e=>handleChange('regex', e.target.value) disabled=disabled)
  `
}

export default TextInputSettings
