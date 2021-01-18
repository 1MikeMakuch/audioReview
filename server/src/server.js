'use strict'

const express = require('express')
const session = require('express-session')

const debug = require('debug')('dt:server')
const debugE = require('debug')('dt:error:server')
const app = express()
const basicAuth = require('express-basic-auth')
const morgan = require('morgan')
const db = require('./db')
const apis = require('./apis')
const utils = require('./utils')
const passport = require('passport')
//const expressValidator = require('express-validator')

// Load env variables from .env
try {
  require('dotenv').config({path: './.env', silent: true})
} catch (e) {
  debugE('Error loading .env', e)
}

app.set('trust proxy', true)
app.use(require('cookie-parser')())
// app.use(require('body-parser').urlencoded({extended: true, limit: '1mb', parameterLimit: 10}))
app.use(require('body-parser').text({type: ['text/plain', 'text/html']})) //{limit: '1mb', parameterLimit: 10}))
app.use(require('body-parser').json({limit: '1mb', parameterLimit: 10}))

async function doit() {
  let {mysql, options} = await db.init()
  const MySQLStore = require('express-mysql-session')(session)

  //   let u = await c.query('select * from users')
  //   debug('mysql test', JSON.stringify(u))

  // COOKIE_SECURE should be true for SSL
  var secure = process.env.COOKIE_SECURE ? true : false

  // SAME_SITE should be 'none' for dev, 'strict' for prod
  var sameSite = process.env.COOKIE_SAME_SITE ? process.env.COOKIE_SAME_SITE : null

  var cookie = {}
  if (secure) {
    cookie.secure = true
  }
  if (sameSite) {
    cookie.sameSite = sameSite
  }
  cookie.httpOnly = process.env.COOKIE_HTTP_ONLY || false

  cookie.originalMaxAge = 1000 * 300 // 5 mins

  debug("before process.env.ENVIRONMENT === 'development'")
  if (process.env.ENVIRONMENT === 'development') {
    let sessionOptions = {
      secret: process.env.SESSION_SECRET,
      // needed to destroy session upon logout, https://medium.com/@caroline.e.okun/read-this-if-youre-using-passport-for-authentication-188d00968f1b
      resave: false,
      saveUninitialized: true,
      store: 'mysql options...',
      unset: 'destroy',
      cookie
    }
    debug('app.use(session:', JSON.stringify(sessionOptions))
    sessionOptions.store = new MySQLStore({}, mysql)
    app.use(session(sessionOptions))
    app.use(passport.initialize())
    app.use(passport.session())

    // Temporary, will be removed when build.js is published
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization'])
      res.header('Access-Control-Allow-Credentials', true)
      next()
    })
  } else {
    let sessionOptions = {
      secret: process.env.SESSION_SECRET,
      // needed to destroy session upon logout, https://medium.com/@caroline.e.okun/read-this-if-youre-using-passport-for-authentication-188d00968f1b
      resave: false,
      saveUninitialized: true,
      store: 'mysql options...',
      unset: 'destroy',
      cookie
    }
    debug('app.use(session:', JSON.stringify(sessionOptions))
    sessionOptions.store = new MySQLStore({}, mysql)
    app.use(session(sessionOptions))
    app.use(passport.initialize())
    app.use(passport.session())

    // Temporary, will be removed when build.js is published
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization'])
      res.header('Access-Control-Allow-Credentials', true)
      next()
    })
  }
  app.use(
    morgan(
      ':res[X-Request-ID] :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
    )
  )

  app.use((req, res, next) => {
    debug(req.ip, req.method, req.url, JSON.stringify({body: req.body, session: req.session}))
    next()
  })

  apis.init(app)

  app.use((err, req, res, next) => {
    debugE('Error in HTTP handler:', req.ip, req.protocol, req.method, req.path, err)
    res.status(500).send('Server Error!\n')
    res.end()
    next()
  })

  debug('version:', 'listening on ', process.env.SERVER_PORT)
  app.listen(process.env.SERVER_PORT)

  utils.mailInit()
}
doit()

module.exports = {app}
