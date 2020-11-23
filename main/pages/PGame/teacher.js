import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Button, H3, Div, Span } from '@startupjs/ui'
import { withRouter } from 'react-router-native'
import { GAME_STATUSES } from 'main/constants'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'
import './index.styl'

export default withRouter(
  observer(({ match }) => {
    const gameId = match.params.gameId
    const [game = {}, $game] = useDoc('games', gameId)
    const [template = {}] = useDoc('templates', game.templateId)
    const [gameGroups] = useQueryTable('gameGroups', {
      query: { gameId }
    })
    const [players] = useQueryTable('users', {
      query: { _id: { $in: game.playerIds } }
    })

    console.log('players', players, game.playerIds)

    const columnsGroups = [
      {
        title: 'Group',
        key: 'group',
        render: (data, index) => pug`
          Span.line.text Group #{index + 1}
        `
      }
    ]

    const columns = [
      {
        title: 'Name',
        key: 'name',
        render: (data) => pug`
          Span.line.text #{data.name}
        `
      },
      {
        title: 'Role',
        key: 'role',
        render: (data) => {
          const groupIndex = gameGroups.findIndex((item) => item.players['data.id'])
          return pug`
            Span.line.text Group #{groupIndex + 1}
          `
        }
      }
    ]

    return pug`
      Div
        H3.centerText #{template.name}
        H3.centerText #{game.status}
        if game.status === GAME_STATUSES.WAIT_PLAYERS
          Table(title='Players' dataSource=players.items columns=columns.slice(0,1) rowKey=item => item.id pagination=players.pagination)
          Button(onPress=() => $game.createGroups()) Form groups
        if game.status === GAME_STATUSES.WAIT_START
          Table(
            title='Groups'
            dataSource=gameGroups.items
            columns=columnsGroups
            rowKey=item => item.id
            pagination=gameGroups.pagination
          )
          Button(onPress=() => $game.setEach({status: GAME_STATUSES.STARTED})) Start game
  `
  })
)
