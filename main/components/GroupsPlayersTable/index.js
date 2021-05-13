import React, { useState, useEffect } from 'react'
import { observer, useSession, useDoc, useQuery } from 'startupjs'
import { Span, Div } from '@startupjs/ui'
import { Table } from 'components'

const GroupsPlayersTable = ({ gameId, onlyUserGroup = false }) => {
  const [user = {}] = useSession('user')
  const [game = {}] = useDoc('games', gameId)
  const [players] = useQuery('users', {
    _id: { $in: game.playerIds }
  })
  const groupFilter = onlyUserGroup ? { [`players.${user.id}`]: { $exists: true } } : {}
  const [gameGroups = []] = useQuery('gameGroups', {
    gameId,
    ...groupFilter
  })
  const [tableData = [], setTableData] = useState([])

  useEffect(() => {
    if (players.length === 0) {
      return
    }
    const res = gameGroups.map(({ players: groupPlayers, ...rest }) => {
      return {
        ...rest,
        players: Object.keys(groupPlayers).reduce((acc, playerId) => {
          const player = players.find((item) => item.id === playerId)
          if (!player) {
            return acc
          }

          return [
            ...acc,
            { name: player.firstName + ' ' + player.lastName, id: playerId, role: groupPlayers[playerId] }
          ]
        }, [])
      }
    })
    setTableData(res)
  }, [JSON.stringify(gameGroups)])

  const columnsGroup = [
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
        return pug`
          Span.line.text #{gameGroups[0].players[data.id]}
        `
      }
    }
  ]

  return pug`
    Div.root
      if onlyUserGroup && tableData[0]
        Table(title='Players' dataSource=tableData[0].players columns=columnsGroup rowKey=item => item.id)
  `
}

export default observer(GroupsPlayersTable)
