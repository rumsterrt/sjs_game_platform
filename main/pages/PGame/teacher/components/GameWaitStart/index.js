import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Button, Span } from '@startupjs/ui'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'
import _toPairs from 'lodash/toPairs'

export default observer(({ gameId }) => {
  const [game = {}, $game] = useDoc('games', gameId)
  const [gameGroups] = useQueryTable('gameGroups', {
    query: { gameId }
  })
  const [players] = useQueryTable('users', {
    query: { _id: { $in: game.playerIds } }
  })

  const columnsGroups = [
    {
      title: 'Group',
      key: 'group',
      render: (data, index) => pug`
        Span.line.text Group #{index + 1}
      `
    }
  ]

  const columnsGroupsUsers = [
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
      render: (data) => pug`
        Span.line.text #{data.role}
      `
    }
  ]

  const groupExpandedRowRender = (row) => {
    const dataSource = _toPairs(row.players).map((item) => {
      const player = players.items.find((user) => user.id === item[0])
      return { ...player, role: item[1] }
    })

    return pug`
      Table(
        dataSource=dataSource
        columns=columnsGroupsUsers
        rowKey=item => item.id
      )
    `
  }

  return pug`
    Table(
      title='Groups'
      dataSource=gameGroups.items
      columns=columnsGroups
      rowKey=item => item.id
      pagination=gameGroups.pagination
      expandedRowKeys='all'
      expandedRowRender=groupExpandedRowRender
    )
    Button(onPress=$game.startGame) Start game
  `
})
