import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { Select, Form } from 'components/Antd'

import _update from 'lodash/update'
import _isEmpty from 'lodash/isEmpty'

const defaultValue = {
  options: []
}

const SelectInputSettings = ({ value = {}, onChange, disabled }) => {
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
      Form.Item(label="Select options")
        Select(
          mode='tags' 
          placeholder='Input options'
          value=value.options
          onChange=newValue=>handleChange('options', newValue)
          disabled=disabled
        )
  `
}

export default SelectInputSettings
