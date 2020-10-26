import React from 'react'
import { TextInput, Button, Checkbox, Span, Div, Br } from '@startupjs/ui'
import { useLoader, Logo } from 'components'
import { observer, emit, useSession } from 'startupjs'
import axios from 'axios'
import './index.styl'

const PLogin = () => {
  const [user, $user] = useSession('user')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [, $topbarProgress] = useLoader()

  React.useEffect(() => {
    if (user) emit('url', '/')
  }, [])

  const onSubmit = async () => {
    try {
      $topbarProgress(true)
      await axios.post('/api/login', {
        email,
        password
      })

      window.location.href += ''
    } catch (err) {
      console.log(err)
    } finally {
      $topbarProgress(false)
    }
  }

  return pug`
    Div.login
      Logo(size=50)
      Span Please fill next fields
      Div.local
        TextInput(value=email name='email' label='Email' placeholder='Enter email' onChange=e=>setEmail(e.target.value))
        Br
        TextInput(value=password label='Password' name='password' placeholder='Enter password' onChange=e=>setPassword(e.target.value))
        Br
        Button(type='primary' onClick=onSubmit) Enter
        Button(type='primary' onClick=() => emit('url', '/auth/register')) Create account
    `
}

export default observer(PLogin)
