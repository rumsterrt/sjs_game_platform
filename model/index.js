import Game from './GameModel'
import GameGroup from './GameGroupModel'

export default function (racer) {
  racer.orm('games.*', Game)
  racer.orm('gameGroups.*', GameGroup)
}
