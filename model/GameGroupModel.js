import { BaseModel } from 'startupjs/orm'
import _toPairs from 'lodash/toPairs'
import _template from 'lodash/template'
import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'
import _uniq from 'lodash/uniq'

export default class GameGroupModel extends BaseModel {
  getCurrentRound = async () => {
    const { id: gameGroupId } = this.get()

    const $rounds = this.query('rounds', { gameGroupId })
    await $rounds.fetch()
    const rounds = $rounds.get()
    await $rounds.unfetch()

    const $gameGroup = this.scope(`gameGroups.${gameGroupId}`)
    await $gameGroup.fetch()
    const gameGroup = $gameGroup.get()
    await $gameGroup.unfetch()

    return rounds.find(({ roundIndex }) => roundIndex === gameGroup.currentRound)
  }

  cancelResponseByPlayer = async (playerId, commonQuestions) => {
    const round = await this.getCurrentRound()
    const $round = this.scope(`rounds.${round.id}`)
    await $round.fetch()
    if (commonQuestions) {
      const answers = _get(round, 'commonAnswers') || { submit: [] }
      answers.submit = answers.submit.filter((item) => item !== playerId)
      $round.setEach({ commonAnswers: answers })
      return
    }
    const answers = _get(round, 'answers') || { submit: [] }
    if (answers[playerId]) {
      answers[playerId].submit = false
      $round.setEach({ answers })
    }
  }

  commonResponseRound = async (playerId, response) => {
    const { id: gameGroupId } = this.get()
    const $gameGroup = this.scope(`gameGroups.${gameGroupId}`)
    await $gameGroup.fetch()
    const gameGroup = $gameGroup.get()
    await $gameGroup.unfetch()

    const round = await this.getCurrentRound()
    const $round = this.scope(`rounds.${round.id}`)
    await $round.fetch()

    const previousAnswers = _get(round, 'commonAnswers') || { submit: [] }

    const newAnswers = {
      response,
      submit: _isEqual(response, previousAnswers.response) ? _uniq([...previousAnswers.submit, playerId]) : [playerId]
    }

    $round.setEach({ commonAnswers: newAnswers })

    // Somebody disagreed or didn't submit
    if (newAnswers.submit.length !== Object.keys(gameGroup.players).length) {
      return
    }

    $gameGroup.setEach({ status: 'processing' })
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

    $round.setEach({ answers: newAnswers })

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

    // Calc scores
    const compiled = _template(`(() => {${template.scoreCalc}})()`)
    const args = _toPairs(gameGroup.players).reduce((acc, item) => {
      return { ...acc, [item[1]]: { response: newAnswers[item[0]].response.map((ans) => `\`${ans}\``) } }
    }, {})

    // Get previous round to calc total score in round
    const $prevRound = this.query('rounds', { gameGroupId, roundIndex: round.roundIndex - 1 })
    await $prevRound.fetch()
    const prevTotalScores = _get($prevRound.get()[0], 'totalScores') || {}
    await $prevRound.unfetch()

    const scoreInfos = _toPairs(gameGroup.players).reduce(
      (acc, item) => {
        // eslint-disable-next-line no-eval
        const roundScore = eval(compiled({ ...args, currentRole: `\`${item[1]}\`` }))
        const totalScore = roundScore + (prevTotalScores[item[0]] || 0)

        return {
          scores: { ...acc.scores, [item[0]]: roundScore },
          totalScores: { ...acc.totalScores, [item[0]]: totalScore }
        }
      },
      { scores: {}, totalScores: {} }
    )

    $round.setEach(scoreInfos)

    if (round.roundIndex + 1 === template.rounds) {
      $gameGroup.setEach({ status: 'finished' })
    } else {
      // Add new round, if we can
      await model.add('rounds', {
        id: model.id(),
        gameGroupId,
        roundIndex: round.roundIndex + 1,
        answers: {}
      })
      $gameGroup.setEach({
        currentRound: round.roundIndex + 1,
        status: template.hasCommon ? 'processing_common' : 'processing'
      })
    }

    await $round.unfetch()
  }
}
