import React from 'react'
import './index.styl'
import { Platform, SafeAreaView, View, ScrollView } from 'react-native'
import { observer, useLocal, emit } from 'startupjs'
import { Content, Portal } from '@startupjs/ui'
import { Loader, Modal, Notification, Logo } from 'components'
import { withRouter } from 'react-router-native'

import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default withRouter(
  observer(function ({ children, location }) {
    const [{ user }] = useLocal('_session')

    if (!user) {
      if (location.pathname.match(/auth\/.+/)) {
        return pug`
          Portal.Provider
            View.authRoot
              Logo
              = children
        `
      }
      emit('url', '/auth/sign-in')
      return null
    }

    const main = pug`
      Portal.Provider
        View.layout
          Modal.Portal
          Notification.Portal
          Loader
          Topbar
          View.contentWrapper
            Sidebar.sidebar
              Content(
                padding
                width='full'
                style={ backgroundColor: 'white', height: '100%', overflowY: 'scroll'}
              )
                Main.content= children
    `
    return main
  })
)

const Main = observer(({ children, style }) => {
  return pug`
    Wrapper
      ScrollView(style=style)
        = children
  `
})

const Wrapper =
  Platform.OS === 'web'
    ? React.memo(({ children }) => children)
    : React.memo(
      ({ children }) => pug`
        SafeAreaView.page(style={ flex: 1, backgroundColor: '#fff' })= children
  `
    )
