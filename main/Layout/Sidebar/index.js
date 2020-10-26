import React from 'react'
import { observer, useLocal, emit } from 'startupjs'
import { SmartSidebar, Div, Br, Menu } from '@startupjs/ui'
import './index.styl'

const menuItems = [
  {
    title: 'Games',
    action: () => emit('url', '/')
  },
  {
    title: 'Past games',
    action: () => emit('url', '/pastgames')
  },
  {
    title: 'Library',
    action: () => emit('url', '/library'),
    onlyTeacher: true
  }
]

export default observer(function ({ children }) {
  const [open, $open] = useLocal('_session.sidebar')
  const [{ user }] = useLocal('_session')
  const renderSidebar = () => pug`
    Div
      Br
      Menu
        each item, index in menuItems
          if !item.onlyTeacher || (item.onlyTeacher && item.isTeacher)
          Menu.Item(key=index onPress=item.action) #{item.title}
  `

  return pug`
    SmartSidebar(
      $open=$open
      renderContent=renderSidebar
      fixedLayoutBreakpoint=10000
    )
      = children
  `
})
