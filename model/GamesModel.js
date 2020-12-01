import { BaseModel } from 'startupjs/orm'
import _get from 'lodash/get'

export default class GamesModel extends BaseModel {
  startGame = async () => {
    const { id: gameId } = this.get()
    const $game = this.scope(`games.${gameId}`)

    $game.setEach({ status: 'started' })
  }

  createGroups = async () => {
    const { id: gameId } = this.get()
    const model = this.root
    const $game = this.scope(`games.${gameId}`)
    await $game.fetch()
    const game = $game.get()
    await $game.unfetch()

    const $template = this.scope(`templates.${game.templateId}`)
    await $template.fetch()
    const template = $template.get()
    await $template.unfetch()

    if (game.status !== 'wait_players' || game.playerIds.length < template.roles) {
      return
    }
    const rolesCount = template.roles.length
    const groupsCount = Math.floor(game.playerIds.length / rolesCount)

    new Array(groupsCount).fill().forEach((_, index) => {
      const players = game.playerIds
        .slice(index * rolesCount, rolesCount)
        .reduce((acc, item, index) => ({ ...acc, [item]: template.roles[index] }), {})
      const gameGroupId = model.id()
      model.add('gameGroups', {
        id: gameGroupId,
        gameId,
        players,
        currentRound: 0,
        status: template.hasCommon ? 'processing_common' : 'processing',
        answers: {}
      })
      model.add('rounds', {
        id: model.id(),
        gameGroupId,
        roundIndex: 0,
        answers: {}
      })
    })
    $game.setEach({ playerIds: game.playerIds.slice(0, groupsCount * rolesCount), status: 'wait_start' })
  }

  responseByPlayer = async (playerId, response, commonQuestions) => {
    if (commonQuestions) {
      this._commonResponse(playerId, response)
      return
    }
    this._individualResponse(playerId, response)
  }

  _commonResponse = async (playerId, response) => {
    const { id: gameId } = this.get()

    const $gameGroups = this.query('gameGroups', { gameId })
    await $gameGroups.subscribe()

    const playerGroup = $gameGroups.get().find((item) => _get(item, `players.${playerId}`))
    const $playerGroup = this.scope(`gameGroups.${playerGroup.id}`)

    await $playerGroup.commonResponseRound(playerId, response)

    await $gameGroups.unsubscribe()
  }

  _individualResponse = async (playerId, response) => {
    const { id: gameId } = this.get()
    const $game = this.scope(`games.${gameId}`)

    const $gameGroups = this.query('gameGroups', { gameId })
    await $gameGroups.subscribe()

    const playerGroup = $gameGroups.get().find((item) => _get(item, `players.${playerId}`))
    const $playerGroup = this.scope(`gameGroups.${playerGroup.id}`)

    await $playerGroup.responseRound(playerId, response)

    if ($gameGroups.get().every((item) => item.status === 'finished')) {
      $game.setEach({ status: 'finished' })
    }

    await $gameGroups.unsubscribe()
  }
}
