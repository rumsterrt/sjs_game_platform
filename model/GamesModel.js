import { BaseModel } from 'startupjs/orm'
import _get from 'lodash/get'

export default class GamesModel extends BaseModel {
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
      console.log('players', players)
      model.addAsync('gameGroups', {
        id: model.id(),
        gameId,
        players,
        currentRound: 0,
        status: 'processing',
        answers: {}
      })
    })
    $game.setEach({ playerIds: game.playerIds.slice(0, groupsCount * rolesCount), status: 'wait_start' })
  }

  responseByPlayer = async (playerId, response) => {
    const { id: gameId } = this.get()
    const $game = this.scope(`games.${gameId}`)

    const $gameGroups = this.query('gameGroups', { gameId })
    await $gameGroups.subscribe()

    const playerGroup = $gameGroups.get().find((item) => _get(item, `players.${playerId}`))
    const $playerGroup = this.scope(`gameGroups.${playerGroup.id}`)

    await $playerGroup.responseRound(playerId, response)
    console.log('gameGroups', $gameGroups.get())
    if ($gameGroups.get().every((item) => item.status === 'finished')) {
      $game.setEach({ status: 'finished' })
    }

    await $gameGroups.unsubscribe()
  }
}
