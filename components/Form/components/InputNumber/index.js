import React from 'react'
import { NumberInput } from '@startupjs/ui'

const InputNumber = ({ value = null, onChange, ...props }) => {
  return pug`
    NumberInput(...props value=value onChangeNumber=onChange)
  `
}

export default InputNumber
