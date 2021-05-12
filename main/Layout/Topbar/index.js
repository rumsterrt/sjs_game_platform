import React from 'react'
import { Div, Row, Button, Span } from '@startupjs/ui'
import { observer, useLocal, emit } from 'startupjs'
import { Logo } from 'components'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

const wrapperStyle = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 5
}

const Topbar = () => {
  const [{ user }] = useLocal('_session')
  const [openSidebar, $openSidebar] = useLocal('_session.sidebar')
  const userName =
    (user.firstName.length + user.lastName.length > 7 ? user.firstName.slice(0, 1) : user.firstName) +
    ' ' +
    user.lastName
  return pug`
    Row.wrapper(vAlign='center' align='between' style=wrapperStyle)
      Row(vAlign='center')
        Button(
          onPress=()=>$openSidebar.set(!openSidebar)
          icon=faBars
          variant='text'
        )
        Logo(pushed onPress=() => emit('url', '/') size=15)
      Div
        Span.userInfo #{user.isTeacher ? 'Professor' : 'Player'}
        Span.userInfo #{userName}
  `
}

export default observer(Topbar)
