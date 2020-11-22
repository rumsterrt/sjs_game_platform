import React from 'react'
import { observer, useSession, emit } from 'startupjs'
import { Span, Button } from '@startupjs/ui'
import { Table } from 'components'
import { useQueryTable } from 'main/hooks'
import { playerGames } from './queries'
import moment from 'moment'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [games = {}, $games] = useQueryTable('games', playerGames(user.id))

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (data) => pug`
        Span #{data.template.name}
      `
    },
    {
      title: 'Teacher',
      key: 'teacher',
      render: (data) => pug`
        Span #{data.teacher.name}
      `
    },
    {
      title: 'Created At',
      key: 'age',
      render: (data) => pug`
        Span #{moment(data.createdAt).format('MM/DD/YYYY')}
      `
    },
    {
      title: 'Players count',
      key: 'playersCount',
      render: (data) => pug`
        Span #{data.playersIds.length}
      `
    },
    {
      title: '',
      key: 'join',
      render: (data) => pug`
        Button(onClick=()=>handleJoinGame(data)) #{data.playersIds.includes(user.id)? 'BACK' : 'JOIN'}
      `
    }
  ]

  const handleJoinGame = (game) => {
    console.log('game', game)
    if (!game.playersIds.includes(user.id)) {
      $games.at(game.id).setEach({
        playersIds: [...game.playersIds, user.id]
      })
    }
    emit('url', '/games/' + game.id)
  }

  return pug`
    if (!games.totalCount)
      Span.title Welcome!
      Span.text We don't have any free games, please wait
    else
      Table(title='Games' dataSource=games.items columns=columns rowKey=item => item._id pagination=games.pagination)
  `
})
