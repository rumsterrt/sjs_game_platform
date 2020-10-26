import React from 'react'
import { Div, Span } from '@startupjs/ui'
import './index.styl'

const Logo = ({ onPress, size = 25 }) => {
  return pug`
    Div.root(onClick=() => onPress && onPress())
      Span.title Game
      Span.title.bottom Platformer
  `
}

export default Logo
