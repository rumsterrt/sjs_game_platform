import React, { useState, useEffect } from 'react'
import { observer, useDoc, useQuery } from 'startupjs'
import { Span, Row } from '@startupjs/ui'
import { View } from 'react-native'
import { useQueryTable } from 'main/hooks'
import { Table } from 'components'
import AnswerPopover from './AnswerPopover'
import _get from 'lodash/get'

import './index.styl'

const RoundsTable = ({ gameGroupId, gameId, includeCurrent, fromLast }) => {
  const [dataSource, setDataSource] = useState([])
  const [gameGroup = {}] = useDoc('gameGroups', gameGroupId)
  const [game = {}] = useDoc('games', gameGroup.gameId)
  const [template = {}] = useDoc('templates', game.templateId)

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
        answers: _get(item, `answers.${player.id}.response`) || [],
        commonAnswers: _get(item, 'commonAnswers.response') || [],
        score: item.scores[player.id],
        totalScore: item.totalScores[player.id]
      }))
    }))
    setDataSource(preparedRounds)
  }, [JSON.stringify(players), JSON.stringify(rounds.items), JSON.stringify(gameGroup)])

  if (!gameId) {
    return null
  }

  const renderFullAnswers = (data) => {
    const role = data.role
    const roleQuestions = (template.questions || []).filter((item) => item.role.includes(role))
    return pug`
      View.answerContainer
        if template.hasCommon
          Row.answerTitle
            Span.answerText Common answers
          each item, index in template.commonQuestions
            Row.answer(key=index)
              Span.answerText #{item.message}: #{data.commonAnswers[index]}
        Row.answerTitle
          Span.answerText Player answers
        each item, index in roleQuestions
          Row.answer(key=index)
            Span.answerText #{item.message}: #{data.answers[index]}
    `
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
        Span.line.text #{data.firstName + ' ' + data.lastName}
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
        AnswerPopover
          = renderFullAnswers(data)
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
    const dataSource = row.players.map((item) => ({ ...item, id: item.id + row.id }))
    return pug`
      Table(
        dataSource=dataSource
        columns=playerColumns
        rowKey=item => item.id
      )
    `
  }

  return pug`
    Table(
      dataSource=dataSource 
      columns=roundColumns 
      rowKey=item => item.id 
      pagination=rounds.pagination 
      colorScheme='secondary' 
      expandedRowRender=roundExpandedRowRender
    )
  `
}

export default observer(RoundsTable)
