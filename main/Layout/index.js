import React from 'react'
import './index.styl'
import { Platform, SafeAreaView, View } from 'react-native'
import { observer, useLocal } from 'startupjs'
import { Content } from '@startupjs/ui'
import { PLogin } from 'main/pages'
import { Loader } from 'components'
import { withRouter } from 'react-router-native'

import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default withRouter(
  observer(function ({ children, location }) {
    const [{ user }] = useLocal('_session')

    if (!user) {
      if (location.pathname.match(/auth\/.+/)) {
        return pug`
          View.layout
            Main.content= children
        `
      }
      return pug`
        View.layout
          Main.content
            PLogin
    `
    }

    const main = pug`
      View.layout
        Topbar
        Sidebar.sidebar
          Content(
            padding
            width='full'
            style={ backgroundColor: 'white'}
          )
            Loader
            Main.content= children
    `
    return main
  })
)

const Main = observer(({ children, style }) => {
  return pug`
    Wrapper
      View(style=style)
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
