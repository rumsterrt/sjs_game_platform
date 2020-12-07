import React, { useEffect } from 'react'
import { Checkbox, Tooltip } from 'components/Antd'
import _isEmpty from 'lodash/isEmpty'

const defaultValue = {
  options: []
}

// eslint-disable-next-line no-template-curly-in-string
const title = 'Pick to use commonAnswers us template, e.g. ${common[0]} for first common answer response'

const SelectInputSettings = ({ value = {}, onChange, disabled, name }) => {
  useEffect(() => {
    if (_isEmpty(value)) {
      onChange(defaultValue)
    }
  }, [])

  return pug`
    Tooltip(title=title)
      Checkbox(value=value onChange=e=>onChange && onChange(e.target.checked) name=name disabled=disabled) Is template
  `
}

export default SelectInputSettings
