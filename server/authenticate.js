import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import _get from 'lodash/get'

passport.use(
  new LocalStrategy(async (email, password, done) => {
    const $authQuery = model.query('auths', { email })
    console.log('asdasdaqwew')
    await $authQuery.fetch()
    const user = ($authQuery.get() || [])[0]
    await $authQuery.unfetch()
    if (!user) {
      return done(null, false)
    }
    const hash = await bcrypt.hash(password, user.salt)
    if (hash !== user.hash) {
      return done(null, false)
    }
    return done(null, user)
  })
)

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const login = async (model, email, password) => {
  const $authQuery = model.query('auths', { email })
  await $authQuery.fetch()
  const authInfo = _get($authQuery.get(), '0')
  await $authQuery.unfetch()

  if (!authInfo) {
    throw new Error('User with this email not found')
  }
  const hash = await bcrypt.hash(password, authInfo.salt)
  if (hash !== authInfo.hash) {
    throw new Error('Invalid password')
  }
  return authInfo.id
}

export const register = async (model, email = '', password, userData = {}) => {
  if (!password || password.length < 8) {
    throw new Error('Password minimal length is 8')
  }

  if (!email || !validateEmail(email)) {
    throw new Error('Invalid email')
  }

  const $authQuery = model.query('auths', { email })
  await $authQuery.fetch()
  const userInfo = _get($authQuery.get(), '0.id')

  if (userInfo) {
    throw new Error('User with this email already exist')
  }
  await $authQuery.unfetch()
  const profile = { email: email.toLowerCase(), ...userData }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  profile.hash = hash
  profile.salt = salt

  const userId = await findOrCreateUser(model, profile)
  return userId
}

export const findOrCreateUser = async (model, userData) => {
  const $authQuery = model.query('auths', { email: userData.email })
  await $authQuery.fetch()
  let userId = _get($authQuery.get(), '0.id')
  await $authQuery.unfetch()

  if (!userId) {
    userId = await createUser(model, userData)
  }

  return userId
}

const createUser = async (model, userData) => {
  const { email, name, hash, salt, isTeacher } = userData
  const userId = model.id()
  let authData = {
    id: userId,
    email,
    hash,
    salt,
    createdAt: Date.now()
  }

  await model.add('auths', authData)
  await model.add('users', {
    id: userId,
    name,
    createdAt: Date.now(),
    isTeacher
  })
  return userId
}
