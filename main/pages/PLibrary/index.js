import React from 'react'
import { observer, emit, useQuery } from 'startupjs'
import { Span, Card, Row, Button } from '@startupjs/ui'
import { Table } from 'components'
import './index.styl'

const LIMIT = 10

const PLibrary = () => {
  const [templates] = useQuery('templates')

  return pug`
    Row
      Card.card(onPress=() => emit('url', '/addTemplate'))
        Span Create new template
      each template in templates.items || []
        Card(key=template.id)
          Span #{template.name}
          Span #{template.description}
          Button Create game
  `
}

export default observer(PLibrary)
