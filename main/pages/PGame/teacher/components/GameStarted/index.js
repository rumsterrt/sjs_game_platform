import React from 'react'
import { observer, useDoc } from 'startupjs'
import { Span } from '@startupjs/ui'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'
import RoundsTable from 'main/components/RoundsTable'

export default observer(({ gameId }) => {
  const [game = {}] = useDoc('games', gameId)
  const [gameGroups] = useQueryTable('gameGroups', {
    query: { gameId }
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
      title='Groups'
      dataSource=gameGroups.items
      columns=columnsGroups
      rowKey=item => item.id
      pagination=gameGroups.pagination
      expandedRowKeys='all'
      expandedRowRender=groupExpandedRowRender
    )
  `
})
