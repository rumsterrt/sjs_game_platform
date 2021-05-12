import React, { useEffect, useState, useMemo } from 'react'
import { Div, Span, Card } from '@startupjs/ui'
import { usePage, observer } from 'startupjs'
import { Text } from 'react-native'
import './index.styl'
import _isNil from 'lodash/isNil'
import _isObject from 'lodash/isObject'
import _isArray from 'lodash/isArray'
import _debounce from 'lodash/debounce'

const FormItem = observer(({ children, name, rules, label }) => {
  const [form] = usePage('form')
  const [value, setValue] = useState(name && form && form.getFieldValue(name))
  const setFormValue = useMemo(() => _debounce((newValue) => form && form.setFieldValue(name, newValue), 300), [
    name,
    form && form.id
  ])

  useEffect(() => {
    form && form._addFieldSettings(name, { rules })
  }, [JSON.stringify(rules), !!form])

  useEffect(() => {
    form && setValue(form.getFieldValue(name))
  }, [_isNil(form && form.getFieldValue(name))])

  const extendChild =
    _isObject(children) && !_isArray(children) && name
      ? React.cloneElement(children, {
          value,
          onChange: (newValue) => {
            setValue(newValue)
            setFormValue(newValue)
          }
        })
      : children

  const error = form && form.getFieldError(name)

  const errorWrapper = (children) => {
    return pug`
      = children
      if error
        Text.errorText= error[0]
    `
  }

  const renderContainer = (children) => {
    if (label) {
      return pug`
        Div.root
          Span.label(variant='description')= label
          Card(
            variant='outlined'
          )
            = children
      `
    } else {
      return pug`
        Div.root= children
      `
    }
  }

  return renderContainer(errorWrapper(extendChild))
})

export default FormItem
