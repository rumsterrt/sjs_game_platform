import React from 'react'
import { Modal, Div, Button } from '@startupjs/ui'
import { observer, usePage, model } from 'startupjs'
import uuid from 'react-native-uuid'

import './index.styl'

const ConfirtModal = ({ title, close, content, onOk }) => {
  const handleConfirm = () => {
    onOk && onOk()
    close()
  }
  return pug`
    Modal(
      onChange=close
      visible
    )
      Modal.Header #{title}
      Modal.Content
        = content
      Modal.Actions
        Button(shape='circle' onPress=close) Close
        Button(shape='circle' onPress=handleConfirm pushed) Confirm
  `
}

const Portal = observer(() => {
  const [modals = []] = usePage('globalModals')

  const modalRender = ({ type, ...modal }) => {
    switch (type) {
      case 'confirm':
        return pug`
          ConfirtModal(...modal)
        `
    }
    return pug`
      Modal(
        title=modal.title
        onChange=modal.close
        visible
      )
        = modal.content
    `
  }
  return pug`
    Div.root
      each modal in modals
        Div.modalWrapper
          = modalRender(modal)
          
  `
})

const confirm = (modals) => {
  const oldModals = model.get('_page.globalModals') || []
  const id = uuid.v4()
  const close = () => {
    const modals = model.get('_page.globalModals') || []
    model.set(
      '_page.globalModals',
      modals.filter((item) => item.id !== id)
    )
  }
  model.set('_page.globalModals', [...oldModals, { ...modals, type: 'confirm', id, close }])
}

export default { confirm, Portal }
