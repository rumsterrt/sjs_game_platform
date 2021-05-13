import React from 'react'
import { Select as JSSelect, Multiselect } from '@startupjs/ui'
import _isObject from 'lodash/isObject'

const Select = ({ value, onChange, mode, options = [], ...props }) => {
  if (mode === 'multiple') {
    const _options =
      !options[0] || _isObject(options[0]) ? options : options.map((item) => ({ label: item, value: item }))

    return pug`
      Multiselect(...props value=options.length > 0 ?value: undefined onChange=onChange options=_options)
    `
  }
  return pug`
    JSSelect(...props value=value onChange=onChange options=options)
  `
}

export default Select
