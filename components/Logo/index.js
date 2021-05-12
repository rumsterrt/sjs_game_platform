import React from 'react'
import { Div, Span, Button } from '@startupjs/ui'
import './index.styl'

const Logo = ({ onPress, size = 32, ...props }) => {
  const Root = onPress ? Button : Div
  return pug`
    Root.root(...props variant=onPress && 'text' onPress=onPress)
      Span.title(style={fontSize:size, lineHeight: size}) Game
      Span.title.bottom(style={fontSize:size, lineHeight: size}) Platformer
  `
}

export default Logo
