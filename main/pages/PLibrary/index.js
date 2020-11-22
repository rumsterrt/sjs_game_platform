import React from 'react'
import { observer, emit, useQuery, model, useSession } from 'startupjs'
import { Span, Card, Row, Button } from '@startupjs/ui'
import { GAME_STATUSES } from 'main/constants'
import './index.styl'

const PLibrary = () => {
  const [user] = useSession('user')
  const [templates] = useQuery('templates', {})
  const [, $games] = useQuery('games', {})

  const handleCreateGame = (templateId) => () => {
    const gameId = model.id()
    $games.add({
      id: gameId,
      teacherId: user.id,
      templateId,
      playersIds: [],
      status: GAME_STATUSES.WAIT_PLAYERS
    })
    emit('url', '/games/' + gameId)
  }

  return pug`
    Row
      Card.card(onPress=() => emit('url', '/addTemplate'))
        Span Create new template
      each template in templates || []
        Card.card(key=template.id)
          Span #{template.name}
          Span #{template.description}
          Button(onPress=handleCreateGame(template.id)) Create game
          Button(onPress=() => emit('url', '/templates/' + template.id)) 
            = user.id === template.id ? "Edit template" : "View template"
  `
}

export default observer(PLibrary)
