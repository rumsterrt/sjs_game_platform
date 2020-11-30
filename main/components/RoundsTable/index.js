import React, { useState, useEffect } from 'react'
import { observer, useDoc, useQuery } from 'startupjs'
import { Span } from '@startupjs/ui'
import { Table } from 'components'
import { useQueryTable } from 'main/hooks'
import _get from 'lodash/get'

import './index.styl'

const RoundsTable = ({ gameGroupId, gameId, includeCurrent, fromLast }) => {
  const [dataSource, setDataSource] = useState([])
  const [gameGroup = {}] = useDoc('gameGroups', gameGroupId)
  const roundQuery = { gameGroupId, $sort: { roundIndex: fromLast ? -1 : 1 } }
  if (!includeCurrent) {
    roundQuery.scores = { $ne: null }
  }
  const [rounds = []] = useQueryTable('rounds', {
    query: roundQuery
  })

  const [players = []] = useQuery('users', {
    _id: { $in: Object.keys(gameGroup.players || {}) }
  })

  useEffect(() => {
    const preparedRounds = rounds.items.map((item) => ({
      ...item,
      players: players.map((player) => ({
        ...player,
        role: gameGroup.players[player.id],
        answers: _get(item, `answers.${player.id}.response`),
        score: item.scores[player.id],
        totalScore: item.totalScores[player.id]
      }))
    }))
    setDataSource(preparedRounds)
  }, [JSON.stringify(players), JSON.stringify(rounds.items), JSON.stringify(gameGroup)])

  if (!gameId) {
    return null
  }

  const roundColumns = [
    {
      title: '',
      key: 'index',
      render: (data) => pug`
        Span.name Round #{data.roundIndex + 1}
      `
    }
  ]

  const playerColumns = [
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
      render: (data) => pug`
        Span.line.text #{data.role}
      `
    },
    {
      title: 'Answers',
      key: 'answers',
      render: (data) => pug`
        Span.line.text #{data.answers.join(',')}
      `
    },
    {
      title: 'Score',
      key: 'score',
      render: (data) => pug`
        Span.line.text #{data.score}
      `
    },
    {
      title: 'Total Score',
      key: 'totalScore',
      render: (data) => pug`
        Span.line.text #{data.totalScore}
      `
    }
  ]

  const roundExpandedRowRender = (row) => {
    return pug`
      Table(
        dataSource=row.players
        columns=playerColumns
        rowKey=item => item.id
      )
    `
  }

  return pug`
    Table(
      dataSource=dataSource 
      columns=roundColumns 
      rowKey=item => item.id pagination=rounds.pagination colorScheme='secondary' 
      expandedRowKeys='all'
      expandedRowRender=roundExpandedRowRender
    )
  `
}

export default observer(RoundsTable)
