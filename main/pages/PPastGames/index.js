import React from 'react'
import { observer, useSession } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import { Table } from 'components'
import GroupsTable from 'main/components/GroupsTable'
import moment from 'moment'
import { useQueryTable } from 'main/hooks'
import { playerGames, teacherGames } from './queries'
import _get from 'lodash/get'
import './index.styl'

const PPastGames = () => {
  const [user] = useSession('user')
  const [games = {}] = useQueryTable('games', user.isTeacher ? teacherGames(user.id) : playerGames(user.id))
  console.log('games', { games })
  const columns = [
    {
      title: 'Name',
      key: 'name',

      ellipsis: true,
      render: (data) => pug`
        Span.line.text #{_get(data,'template.name')}
      `
    },
    {
      title: 'Teacher',
      key: 'teacher',

      ellipsis: true,
      render: (data) => pug`
        Span.line.text #{user.isTeacher ? user.name : _get(data,'teacher.name')}
      `
    },
    {
      title: 'Rounds',
      key: 'rounds',
      render: (data) => pug`
        Span.line.text #{_get(data,'template.rounds')}
      `
    },
    {
      title: 'Created At',
      key: 'createdAt',
      render: (data) => pug`
        Span.text #{moment(data.createdAt).format('MM/DD/YYYY')}
      `
    }
  ]

  const rowExpandRender = (record) => {
    return pug`
      GroupsTable(gameId=record.id)
    `
  }

  return pug`
    Div.root
      Div.coursesContainer
        Div.table
          Table(
            title='Past games'
            dataSource=games.items
            pagination=games.pagination
            columns=columns
            rowKey=item => item.id
            expandedRowRender=rowExpandRender
          )
  `
}

export default observer(PPastGames)
