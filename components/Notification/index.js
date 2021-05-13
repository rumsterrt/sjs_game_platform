import React from 'react'
import { Div, Alert } from '@startupjs/ui'
import { observer, usePage, model } from 'startupjs'
import uuid from 'react-native-uuid'

import './index.styl'

const Portal = observer(() => {
  const [notifications = []] = usePage('globalNotifies')
  return pug`
    Div.root
      each notify in notifications.slice(0,10)
        Div.notifyWrapper
          Alert(variant=notify.type || 'info' title=notify.title onClose=notify.close)
            = notify.message
          
  `
})

const addNotify = (notify) => {
  const oldNotifies = model.get('_page.globalNotifies') || []
  const id = uuid.v4()
  const close = () => {
    const notifies = model.get('_page.globalNotifies') || []
    model.set(
      '_page.globalNotifies',
      notifies.filter((item) => item.id !== id)
    )
  }
  model.set('_page.globalNotifies', [...oldNotifies, { ...notify, id, close }])
  setTimeout(() => {
    close()
  }, 10000)
}

export default { Portal, addNotify }
