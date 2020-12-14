import React, { useEffect } from 'react'
import { useLoader, Logo } from 'components'
import { Div } from '@startupjs/ui'
import { observer, emit, useSession } from 'startupjs'
import axios from 'axios'
import { Form, Input, Button, notification } from 'components/Antd'
import _get from 'lodash/get'
import './index.styl'

const PLogin = () => {
  const [user] = useSession('user')
  const [, $topbarProgress] = useLoader()

  useEffect(() => {
    if (user) emit('url', '/')
  }, [])

  const onSubmit = async (values) => {
    try {
      $topbarProgress(true)
      await axios.post('/api/login', values)

      window.location.href += ''
    } catch (err) {
      console.log(err)
      const description = _get(err, 'response.data.error.message', 'Something goes wrong!')
      notification.error({ message: description })
    } finally {
      $topbarProgress(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('onFinishFailed', errorInfo)
    notification.error({ message: 'Check fields errors!' })
  }

  return pug`
    Div.root
      Logo(size=50)
      Form(
        name='login'
        onFinish=onSubmit
        onFinishFailed=onFinishFailed
        layout='vertical'
      )
        Form.Item(name='email' label='Email' rules=[{ required: true, message: 'Please input your Email!' }])
          Input(placeholder="Email")
        Form.Item(name='password' label='Password' rules=[{ required: true, message: 'Please input your Password!' }])
          Input(type="password" placeholder="Password")
        Form.Item
          Button(type='primary' htmlType='submit') Log in
        Form.Item
          = 'Or'
          Button(type='link' onClick=() => emit('url', '/auth/register')) Create account
  `
}

export default observer(PLogin)
