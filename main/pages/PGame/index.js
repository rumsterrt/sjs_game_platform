import React from 'react'
import { observer, useSession } from 'startupjs'
import './index.styl'

import Player from './player'
import Teacher from './teacher'

const PGame = () => {
  const [user] = useSession('user')

  return pug`
    if user.isTeacher
      Teacher
    else
      Player
  `
}

export default observer(PGame)
