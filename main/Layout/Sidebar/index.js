import React, { useLayoutEffect } from 'react'
import { observer, useLocal, emit, useValue } from 'startupjs'
import { Sidebar, DrawerSidebar } from '@startupjs/ui'
import { Dimensions } from 'react-native'
import { Menu } from 'components/Antd'
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

export default observer(function ({ children, ...props }) {
  const [$open] = useLocal('_session.sidebar')
  const [{ user }] = useLocal('_session')
  const [fixedLayout, $fixedLayout] = useValue(isFixedLayout())

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  const renderSidebar = () => pug`
    Menu(mode="inline" style={height: '100%'})
      each item, index in menuItems
        if !item.onlyTeacher || (item.onlyTeacher && user.isTeacher)
          Menu.Item(key=index onClick=item.action) #{item.title}
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
  console.log('sidebarPropsConcat', sidebarPropsConcat)
  return pug`
    if fixedLayout
      Sidebar(...sidebarPropsConcat)= children
    else
      DrawerSidebar(...sidebarPropsConcat)= children
  `
})
