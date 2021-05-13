import React, { useLayoutEffect } from 'react'
import { observer, useLocal, emit, useValue } from 'startupjs'
import { Sidebar as JSSidebar, DrawerSidebar, Menu } from '@startupjs/ui'
import { Dimensions } from 'react-native'
import { withRouter } from 'react-router-native'
import { onLogout } from '@startupjs/auth'
import './index.styl'

const defaultSidebarProps = {
  forceClosed: false,
  position: 'left',
  width: 264,
  backgroundColor: 'white'
}

const isFixedLayout = () => {
  let dim = Dimensions.get('window')
  return dim.width > 1024
}

const menuItems = [
  {
    title: 'Games',
    location: '/',
    action: () => emit('url', '/')
  },
  {
    title: 'Past games',
    location: '/pastgames',
    action: () => emit('url', '/pastgames')
  },
  {
    title: 'Library',
    location: '/library',
    action: () => emit('url', '/library'),
    onlyTeacher: true
  },
  {
    title: 'Exit',
    action: onLogout
  }
]

const Sidebar = function ({ children, location, ...props }) {
  const [, $open] = useLocal('_session.sidebar')
  const [{ user }] = useLocal('_session')
  const [fixedLayout, $fixedLayout] = useValue(isFixedLayout())

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  const handleSidebarClick = (action) => () => {
    action && action()
    $open.set(false)
  }

  const renderSidebar = () => pug`
    Menu(style={height: '100%', background: '#F5F5F5'})
      each item, index in menuItems
        if !item.onlyTeacher || (item.onlyTeacher && user.isTeacher)
          Menu.Item(
            key=index
            onPress=handleSidebarClick(item.action)
            active=item.location === location.pathname
          ) #{item.title}
  `

  const handleWidthChange = () => {
    $fixedLayout.setDiff(isFixedLayout())
  }

  const sidebarPropsConcat = {
    ...defaultSidebarProps,
    ...props,
    defaultOpen: true,
    $open,
    renderContent: renderSidebar,
    contentStyle: { overflow: 'scroll', height: '100%' }
  }

  return pug`
    if fixedLayout
      JSSidebar(...sidebarPropsConcat)= children
    else
      DrawerSidebar(...sidebarPropsConcat)= children
  `
}

export default withRouter(observer(Sidebar))
