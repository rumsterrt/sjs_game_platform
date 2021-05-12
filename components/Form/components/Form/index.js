import React, { useEffect, useState } from 'react'
import { Div } from '@startupjs/ui'
import { model, observer, useValue, emit, useOn } from 'startupjs'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _isArray from 'lodash/isArray'
import uuid from 'react-native-uuid'

export const useForm = ({ initValue = {} } = {}) => {
  const [id] = useState(uuid.v4())
  const [values, $values] = useValue(initValue)
  const [fieldsSetting, $fieldsSetting] = useValue({})
  const [, $fieldsError] = useValue({})
  const [initValues] = useState(initValue)

  const resetFields = () => {
    $values.set(initValues)
  }

  const formatNameToString = (name) => (_isArray(name) ? name.join('.') : name)

  const _addFieldSettings = (name, settings) => {
    const currentValues = $values.get()
    if (!currentValues[name]) {
      $values.set(_set(currentValues, name, _get(initValues, name)))
    }
    $fieldsSetting.setEach({ [formatNameToString(name)]: settings })
  }

  const getFieldError = (name) => _get($fieldsError.get(), name)

  const getFieldValue = (name) => _get($values.get(), name)
  const setFieldValue = (name, value) => {
    $values.set(_set($values.get(), name, value))
    validateField(formatNameToString(name))
    emit(`form.${id}.updateValues`, $values.get())
  }
  const validateFields = () => {
    const errorFields = {}
    Object.keys(fieldsSetting).forEach((name) => {
      const invalidInfo = validateField(name)
      if (invalidInfo) {
        errorFields[name] = invalidInfo
      }
    })

    if (Object.values($fieldsError.get()).find((item) => !!item)) {
      throw new Error('Check fields errors!')
    }
    return values
  }
  const validateField = (name) => {
    const rules = fieldsSetting[name]?.rules
    const fieldValue = _get($values.get(), name)

    if (!rules) {
      $fieldsError.setEach({ [name]: null })
      return
    }
    const errors = []
    rules.forEach((rule) => {
      if (rule.required && !fieldValue) {
        errors.push(rule.message || 'Fill in the field')
      }
    })
    if (errors.length === 0) {
      $fieldsError.setEach({ [name]: null })
      return
    }
    $fieldsError.setEach({ [name]: errors })
  }
  return [
    {
      getFieldValue,
      setFieldValue,
      validateFields,
      _addFieldSettings,
      getFieldError,
      resetFields,
      id
    }
  ]
}

const Form = observer(({ children, form, initialValues, onValuesChange }) => {
  useEffect(() => {
    model.set('_page.form', form)
  }, [!!form])
  useOn(`form.${form && form.id}.updateValues`, (values) => {
    onValuesChange && onValuesChange(values)
  })
  return pug`
    Div.root
    = children
  `
})

export default Form
