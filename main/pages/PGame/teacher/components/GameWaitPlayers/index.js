import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Button, Span } from '@startupjs/ui'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'

export default observer(({ gameId }) => {
  const [game = {}, $game] = useDoc('games', gameId)
  const [gameGroups] = useQueryTable('gameGroups', {
    query: { gameId }
  })
  const [players] = useQueryTable('users', {
    query: { _id: { $in: game.playerIds } }
  })

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (data) => pug`
        Span.line.text #{data.firstName + ' ' + data.lastName}
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
    Table(title='Players' dataSource=players.items columns=columns.slice(0,1) rowKey=item => item.id pagination=players.pagination)
    Button(onPress=() => $game.createGroups()) Form groups
  `
})
