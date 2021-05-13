import React, { useState } from 'react'
import { Span, Button, Popover } from '@startupjs/ui'
import { View } from 'react-native'

import './index.styl'

const AnswerPopover = ({ children }) => {
  const [visible, setVisible] = useState(false)
  return pug`
    Popover(
      visible=visible
      onDismiss=() => setVisible(false)
    )
      Popover.Caption
        Button(onPress=() => setVisible(!visible) ) Show answers
      View.answerPop
        Span Answers
        = children
  `
}

export default AnswerPopover
