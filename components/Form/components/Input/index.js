import React from 'react'
import { TextInput } from '@startupjs/ui'

const Input = ({ value, onChange, ...props }) => {
  return pug`
    TextInput(...props value=value onChangeText=onChange)
  `
}

export default Input
