import React from 'react'
import { observer, useDoc, useSession } from 'startupjs'
import { Span } from '@startupjs/ui'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'
import RoundsTable from 'main/components/RoundsTable'

export default observer(({ gameId }) => {
  const [user = {}] = useSession('user')
  const [game = {}] = useDoc('games', gameId)
  const groupFilter = !user.isTeacher ? { [`players.${user.id}`]: { $exists: true } } : {}
  const [gameGroups] = useQueryTable('gameGroups', {
    query: { gameId, ...groupFilter }
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

  const groupExpandedRowRender = (row) => {
    return pug`
      RoundsTable(gameGroupId=row.id gameId=game.id)
    `
  }

  return pug`
    Table(
      dataSource=gameGroups.items
      columns=columnsGroups
      rowKey=item => item.id
      pagination=gameGroups.pagination
      expandedRowRender=groupExpandedRowRender
    )
  `
})
