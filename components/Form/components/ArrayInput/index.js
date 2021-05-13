import React, { useEffect } from 'react'
import { observer, useValue } from 'startupjs'
import { ArrayInput as JSArrayInput } from '@startupjs/ui'

const ArrayInput = observer(({ value, onChange, children, label, ...props }) => {
  const [arrValue, $arrValue] = useValue(value || [])
  useEffect(() => {
    onChange(arrValue)
  }, [JSON.stringify(arrValue)])

  return pug`
    JSArrayInput(...props value=arrValue $value=$arrValue)
  `
})

export default ArrayInput
