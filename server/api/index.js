import express from 'express'
import { runHttpHandler } from 'serverHelpers/lifecicle'
import { register, login } from '../authenticate'
import passport from 'passport'

const router = express.Router()

router.post(
  '/register',
  runHttpHandler(async (req) => {
    const { model } = req
    const { name, isTeacher, password, email } = req.body
    const userId = await register(model, email, password, { isTeacher, name })

    req.session.userId = userId
    req.session.loggedIn = true
    const $session = req.model.scope('_session')
    $session.set('loggedIn', true)
    return { userId }
  })
)

router.post(
  '/login',
  runHttpHandler(async (req) => {
    const { model } = req
    const { email, password } = req.body
    const userId = await login(model, email, password)

    req.session.userId = userId
    req.session.loggedIn = true

    const $session = req.model.scope('_session')
    $session.set('loggedIn', true)
    return userId
  })
)

router.get(
  '/logout',
  runHttpHandler(async (req) => {
    delete req.session.userId
    delete req.session.user
    return true
  })
)

// Add new REST API routes here

export default router
