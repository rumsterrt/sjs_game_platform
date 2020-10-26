import React from 'react'
import { TextInput, Button, Checkbox, Span, Div, Br } from '@startupjs/ui'
import { useLoader, Logo } from 'components'
import { observer, emit, useSession } from 'startupjs'
import axios from 'axios'
import './index.styl'

const PRegister = () => {
  const [user, $user] = useSession('user')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isTeacher, setIsTeacher] = React.useState(false)
  const [, $topbarProgress] = useLoader()

  React.useEffect(() => {
    if (user) emit('url', '/')
  }, [])

  const onSubmit = async () => {
    try {
      $topbarProgress(true)
      const { data } = await axios.post('/api/register', {
        name,
        email,
        password,
        isTeacher
      })

      $user.set(data)
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
        TextInput(value=name name='name' label='Name' placeholder='Enter name' onChange=e=>setName(e.target.value))
        Br
        TextInput(value=email name='email' label='Email' placeholder='Enter email' onChange=e=>setEmail(e.target.value))
        Br
        TextInput(value=password label='Password' name='password' placeholder='Enter password' onChange=e=>setPassword(e.target.value))
        Br
        Checkbox(value=isTeacher name='isTeacher' onChange=setIsTeacher label="I'm teacher")
        Br
        Button(type='primary' onClick=onSubmit) Enter
    `
}

export default observer(PRegister)
