import React from 'react'
import { Div, Span } from '@startupjs/ui'
import './index.styl'

const Logo = ({ onPress, size = 32 }) => {
  return pug`
    Div.root(onClick=() => onPress && onPress())
      Span.title(style={fontSize:size+'px', lineHeight: size}) Game
      Span.title.bottom(style={fontSize:size+'px', lineHeight: size}) Platformer
  `
}

export default Logo
