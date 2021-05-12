import React from 'react'
import { Checkbox } from '@startupjs/ui'

const Input = ({ value = false, onChange, children, label, ...props }) => {
  return pug`
    Checkbox(...props value=value onChange=onChange label=label || children)
  `
}

export default Input
