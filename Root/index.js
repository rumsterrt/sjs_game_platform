import { BASE_URL } from '@env'
import init from 'startupjs/init'
import orm from '../model'
import React from 'react'
import App from 'startupjs/app'
import { observer, model } from 'startupjs'
import { initAuthApp } from '@startupjs/auth'
import { Platform } from 'react-native'
import { LoginForm, RegisterForm, RecoverForm } from '@startupjs/auth-local'
import Layout from 'main/Layout'

import Joi from '@hapi/joi'

// Frontend micro-services
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

const customRegisterProp = {
  properties: {
    isTeacher: {
      input: 'checkbox',
      label: 'Is Teacher'
    }
  },
  validateSchema: {
    isTeacher: Joi.boolean().messages({
      'any.required': 'Fill in the field',
      'string.empty': 'Fill in the field'
    })
  }
}
const auth = initAuthApp({
  Layout,
  localForms: {
    'sign-in': <LoginForm />,
    'sign-up': <RegisterForm {...customRegisterProp} />,
    recover: <RecoverForm />
  },
  renderForm: ({ localActiveForm }) => localActiveForm
})

export default observer(() => {
  return pug`
    App(
      apps={main, auth}
    )
  `
})
