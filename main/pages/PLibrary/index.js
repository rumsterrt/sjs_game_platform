import React from 'react'
import { observer, emit, useQuery, model, useSession } from 'startupjs'
import { Span, Card, Div, Icon, Button } from '@startupjs/ui'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'components/Antd'
import { GAME_STATUSES } from 'main/constants'

import './index.styl'

const PLibrary = () => {
  const [user] = useSession('user')
  const [templates, $template] = useQuery('templates', {})
  const [, $games] = useQuery('games', {})

  const handleCreateGame = (templateId) => () => {
    const gameId = model.id()
    $games.add({
      id: gameId,
      teacherId: user.id,
      templateId,
      playerIds: [],
      status: GAME_STATUSES.WAIT_PLAYERS
    })
    emit('url', '/games/' + gameId)
  }

  const handleDelete = (templateId) => () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Template will be deleted. Are you sure?',
      onOk: () => $template.del(templateId)
    })
  }

  return pug`
    Div.root
      Card.card(onPress=() => emit('url', '/addTemplate'))
        Icon.plusIcon(icon=faPlus)
      each template in templates || []
        Card.card(key=template.id)
          if template.teacherId === user.id
            Button.deleteButton(icon=faTimes variant='text' onPress=handleDelete(template.id))
          Span.title.cardItem #{template.name}
          Button.cardItem(onPress=handleCreateGame(template.id)) Create game
          Button.cardItem.last(onPress=() => emit('url', '/templates/' + template.id)) 
            = user.id === template.id ? "Edit template" : "View template"
  `
}

export default observer(PLibrary)
