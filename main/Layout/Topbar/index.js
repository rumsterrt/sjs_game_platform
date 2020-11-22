import React, { useState } from 'react'
import { Menu, Icon, Span, Div, Row, Button } from '@startupjs/ui'
import { observer, useLocal, emit } from 'startupjs'
import { Logo } from 'components'
import { logout } from 'clientHelpers'
import { faArrowDown, faArrowUp, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

const MenuItem = Menu.Item

const menuItems = [
  {
    title: 'Exit',
    icon: faSignOutAlt,
    style: { alignSelf: 'center' },
    action: () => logout()
  }
]

const Topbar = () => {
  const [{ user }] = useLocal('_session')
  const [openSidebar, $openSidebar] = useLocal('_session.sidebar')
  const [menuOpen, setMenuOpen] = useState(false)
  return pug`
    Div.wrapper
      Div.root
        Div.content
          Row(vAlign='center')
            Button(
              onClick=()=>$openSidebar.set(!openSidebar)
              icon=faBars
              variant='text'
            )
            Logo(onPress=() => emit('url', '/') size=15)
          Button(
            onClick=() => setMenuOpen(!menuOpen)
            icon=menuOpen?faArrowUp:faArrowDown
            variant='text'
            iconPosition='right'
          ) #{user.isTeacher ? 'Professor' : 'Player'} #{user.name}
            Menu.menu(styleName=[{hide: !menuOpen}])
              each item in menuItems
                MenuItem.menuItem(key=item.title onPress=() => {
                  item.action()
                  setMenuOpen(false)
                })
                  Row(align='between')
                    Span #{item.title} 
                    if item.icon
                      Icon.currentPlayerState(icon=item.icon size=20 style=item.style)
                    
  `
}

export default observer(Topbar)
