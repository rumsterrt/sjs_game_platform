import React from 'react'
import { observer, useSession, emit } from 'startupjs'
import { Span, Button } from '@startupjs/ui'
import { Table } from 'components'
import moment from 'moment'
import { useQueryTable } from 'main/hooks'
import { teacherGames } from './queries'
import _get from 'lodash/get'
import './index.styl'

export default observer(() => {
  const [user] = useSession('user')
  const [{ items, pagination }] = useQueryTable('games', teacherGames(user.id))

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (data) => pug`
        Span.line.text #{data.template.name}
      `
    },
    {
      title: 'Created At',
      key: 'age',
      render: (data) => pug`
        Span.text #{moment(data.createdAt).format('MM/DD/YYYY')}
      `
    },
    {
      title: 'Players count',
      key: 'playersCount',
      render: (data) => pug`
        Span.line.text #{_get(data,'playerIds.length', 0)}
      `
    },
    {
      title: '',
      key: 'join',
      render: (data) => pug`
        Button(onPress=()=>emit('url', '/games/' + data.id)) JOIN
      `
    }
  ]

  return pug`
    Table(title='Active Games' dataSource=items columns=columns rowKey=item => item.id pagination=pagination)
  `
})
