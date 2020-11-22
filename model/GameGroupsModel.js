import { BaseModel } from 'startupjs/orm'
import _toPairs from 'lodash/toPairs'
import _template from 'lodash/template'

export default class GameGroupsModel extends BaseModel {
  getCurrentRound = async () => {
    const { id: gameGroupId } = this.get()
    const model = this.root

    const $rounds = this.query('rounds', { gameGroupId })
    await $rounds.fetch()
    const rounds = $rounds.get()
    await $rounds.unfetch()

    let roundId, roundData

    // Game just started
    console.log('rounds', rounds)
    if (rounds.length === 0) {
      roundId = model.id()
      roundData = {
        id: roundId,
        gameGroupId,
        roundIndex: 0,
        answers: {}
      }
      model.add('rounds', roundData)
    } else {
      const $gameGroup = this.scope(`gameGroups.${gameGroupId}`)
      await $gameGroup.fetch()
      const gameGroup = $gameGroup.get()
      await $gameGroup.unfetch()
      console.log('rounds', rounds)
      roundData = rounds.find((item) => item.roundIndex === gameGroup.currentRound)
      roundId = roundData.id
    }

    return roundData
  }

  responseRound = async (playerId, response) => {
    const { id: gameGroupId } = this.get()
    const model = this.root
    const $gameGroup = this.scope(`gameGroups.${gameGroupId}`)
    await $gameGroup.fetch()
    const gameGroup = $gameGroup.get()
    await $gameGroup.unfetch()

    const round = await this.getCurrentRound()
    const $round = this.scope(`rounds.${round.id}`)
    await $round.fetch()

    const newAnswers = {
      ...round.answers,
      [playerId]: {
        response,
        submit: true
      }
    }
    console.log('$round', { $round, round })
    $round.setEach({ answers: newAnswers })
    await $round.fetch()

    // Everybody responded
    if (Object.keys(newAnswers).length !== Object.keys(gameGroup.players).length) {
      return
    }

    const $game = this.scope(`games.${gameGroup.gameId}`)
    await $game.fetch()
    const game = $game.get()
    await $game.unfetch()
    const $template = this.scope(`templates.${game.templateId}`)
    await $template.fetch()
    const template = $template.get()
    await $template.unfetch()

    // TODO: calc results
    const compiled = _template(`(() => {${template.scoreCalc}})()`)
    const args = _toPairs(gameGroup.players).reduce((acc, item) => {
      return { ...acc, [item[1]]: { response: newAnswers[item[0]].response.map((ans) => `\`${ans}\``) } }
    }, {})

    // eslint-disable-next-line no-eval
    $round.setEach({ winner: eval(compiled(args)) })

    if (round.roundIndex + 1 === template.rounds) {
      $gameGroup.setEach({ status: 'finished' })
      return
    }

    // Add new round, if we can
    model.add('rounds', {
      id: model.id(),
      gameGroupId,
      roundIndex: round.roundIndex + 1,
      answers: {}
    })
    $gameGroup.setEach({ currentRound: round.roundIndex + 1 })
  }
}
