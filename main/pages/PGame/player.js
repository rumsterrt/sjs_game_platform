import React from 'react'
import { observer, useSession, useDoc, useQuery } from 'startupjs'
import { Span, Div } from '@startupjs/ui'
import { withRouter } from 'react-router-native'
import _get from 'lodash/get'
import { GAME_STATUSES } from 'main/constants'
import GroupsPlayersTable from 'main/components/GroupsPlayersTable'
import RoundForm from 'main/components/RoundForm'
import './index.styl'

export default withRouter(
  observer(({ location, match }) => {
    const gameId = match.params.gameId
    const [user = {}] = useSession('user')
    const [game = {}] = useDoc('games', gameId)

    const [gameGroups = []] = useQuery('gameGroups', {
      gameId: game.id,
      [`players.${user.id}`]: { $ne: null }
    })

    const [gameGroup = { status: 'processing' }] = useDoc('gameGroups', _get(gameGroups, '[0].id'))

    return pug`
      Div.root
        if game.status === GAME_STATUSES.WAIT_PLAYERS
          Span Waiting for group formation
        if game.status === GAME_STATUSES.WAIT_START
          GroupsPlayersTable(gameId=gameId onlyUserGroup)
          Span Waiting to start the game
        if game.status === GAME_STATUSES.STARTED && gameGroup.status === 'processing_common'
          RoundForm(gameGroupId=gameGroup.id common)
        if game.status === GAME_STATUSES.STARTED && gameGroup.status === 'processing'
          RoundForm(gameGroupId=gameGroup.id)
        if game.status === GAME_STATUSES.FINISHED || gameGroup.status === 'finished'
          Span Game already finished
  `
  })
)
