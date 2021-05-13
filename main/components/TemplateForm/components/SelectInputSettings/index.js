import React, { useEffect } from 'react'
import { Card } from '@startupjs/ui'
import { ArrayInput, FormItem } from 'components/Form'
import _cloneDeep from 'lodash/cloneDeep'
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
    const newValue = _cloneDeep(value)
    _update(newValue, path, () => fieldValue || null)
    onChange(newValue)
  }

  return pug`
    Card
      FormItem(label="Select options")
        ArrayInput(
        items={
          input: 'text'
        } 
        placeholder='Input options'
        value=value.options
        onChange=newValue=>handleChange('options', newValue)
        disabled=disabled)
  `
}

export default SelectInputSettings
