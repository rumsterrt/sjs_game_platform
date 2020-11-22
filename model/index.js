import Games from './GamesModel'
import GameGroups from './GameGroupsModel'

export default function (racer) {
  racer.orm('games.*', Games)
  racer.orm('gameGroups.*', GameGroups)
}
