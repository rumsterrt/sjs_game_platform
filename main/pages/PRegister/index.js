import React from 'react'
import { Div } from '@startupjs/ui'
import { useLoader, Logo } from 'components'
import { observer, emit, useSession } from 'startupjs'
import axios from 'axios'
import { Form, Input, Button, Checkbox } from 'components/Antd'
import './index.styl'

const PRegister = () => {
  const [user, $user] = useSession('user')
  const [, $topbarProgress] = useLoader()

  React.useEffect(() => {
    if (user) emit('url', '/')
  }, [])

  const onSubmit = async (values) => {
    try {
      $topbarProgress(true)
      const { data } = await axios.post('/api/register', values)

      $user.set(data)
      window.location.href += ''
    } catch (err) {
      console.log(err)
    } finally {
      $topbarProgress(false)
    }
  }

  return pug`
    Div.root
      Logo(size=50)
      Form(name='login' onFinish=onSubmit layout='vertical')
        Form.Item(name='name' label='Name' rules=[{ required: true, message: 'Please input your Name!' }])
          Input(placeholder="Name")
        Form.Item(name='email' label='Email' rules=[{ required: true, message: 'Please input your Email!' }])
          Input(placeholder="Email")
        Form.Item(name='password' label='Password' rules=[{ required: true, message: 'Please input your Password!' }])
          Input(type="password" placeholder="Password")
        Form.Item(name='isTeacher' valuePropName="checked")
          Checkbox I'm teacher
        Form.Item
          Button(type='primary' htmlType='submit') Register
        Form.Item
          = 'Or'
          Button(type='link' onClick=() => emit('url', '/auth/login')) Login
    `
}

export default observer(PRegister)
