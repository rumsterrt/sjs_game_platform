import React from 'react'
import { observer, useDoc } from 'startupjs'
import { H3, Div } from '@startupjs/ui'
import { withRouter } from 'react-router-native'
import { GAME_STATUSES } from 'main/constants'
import { GameWaitPlayers, GameWaitStart, GameStarted } from './components'
import './index.styl'

export default withRouter(
  observer(({ match }) => {
    const gameId = match.params.gameId
    const [game = {}] = useDoc('games', gameId)
    const [template = {}] = useDoc('templates', game.templateId)

    return pug`
      Div
        H3.centerText #{template.name}
        H3.centerText #{game.status}
        if game.status === GAME_STATUSES.WAIT_PLAYERS
          GameWaitPlayers(gameId=gameId)
        if game.status === GAME_STATUSES.WAIT_START
          GameWaitStart(gameId=gameId)
        if game.status === GAME_STATUSES.STARTED
          GameStarted(gameId=gameId)
        if game.status === GAME_STATUSES.FINISHED
          GameStarted(gameId=gameId)
  `
  })
)
