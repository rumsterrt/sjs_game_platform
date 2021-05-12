import init from 'startupjs/init'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { initAuth } from '@startupjs/auth/server'
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
export default (done) => {
  startupjsServer(
    {
      getHead,
      sessionMaxAge: 1000 * 60 * 60 * 4 // 4 hours
    },
    (ee, options) => {
      initApp(ee)
      initAuth(ee, {
        strategies: [new LocalStrategy({})]
      })

      ee.on('done', () => {
        done && done()
      })
    }
  )
}

const getHead = (appName) => {
  return `
    <title>HelloWorld</title>
    <!-- Put vendor JS and CSS here -->
  `
}
