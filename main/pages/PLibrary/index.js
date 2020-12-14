import React from 'react'
import { observer, emit, useQuery, model, useSession } from 'startupjs'
import { Span, Card, Div, Icon, Button, Row } from '@startupjs/ui'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, notification, Upload, Button as AntButton } from 'components/Antd'
import { useLoader } from 'components'
import { GAME_STATUSES } from 'main/constants'
import _isArray from 'lodash/isArray'

import './index.styl'

const PLibrary = () => {
  const [user] = useSession('user')
  const [templates, $template] = useQuery('templates', {})
  const [, $games] = useQuery('games', {})
  const [topbarProgress, $topbarProgress] = useLoader()

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

  const uploadFile = (file) => {
    $topbarProgress(true)
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = async () => {
      try {
        const readerData = JSON.parse(reader.result)
        const newTemplates = _isArray(readerData) ? readerData : [readerData]
        newTemplates.forEach((template) => $template.add({ ...template, teacherId: user.id }))
      } catch (err) {
        notification.error({ message: 'Can upload file' })
      } finally {
        $topbarProgress(false)
      }
    }
  }

  return pug`
    Div.root
      Row.actions
        Upload(beforeUpload=uploadFile accept="file" fileList=null)
          AntButton(disabled=topbarProgress loading=topbarProgress type="primary") Import from JSON
      Div.main
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
