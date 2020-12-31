'use strict'

const express = require('express')
//const session = require('express-session')

const debug = require('debug')('dt:server')
const debugE = require('debug')('dt:error:server')
const app = express()
const basicAuth = require('express-basic-auth')
const expressValidator = require('express-validator')
const morgan = require('morgan')
const db = require('./db')
const apis = require('./apis')

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

// app.use(
//   require('express-validator')({
//     customValidators: {
//       isArray: value => {
//         return Array.isArray(value)
//       },
//       inDb: value => {
//         // TODO
//       }
//     }
//   })
// )

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
cookie.httpOnly = true

if (process.env.ENVIRONMENT === 'development') {
  //   app
  //     .use
  //     session({
  //       secret: process.env.SESSION_SECRET,
  //       resave: false,
  //       saveUninitialized: true,
  //       store: new (require('express-mysql-session')(session))(bookshelf.knex.client.config.connection),
  //       unset: 'destroy',
  //       cookie
  //     })
  //     ()

  // Temporary, will be removed when build.js is published
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization'])
    res.header('Access-Control-Allow-Credentials', true)
    next()
  })
} else {
  //   app
  //     .use
  //     session({
  //       secret: process.env.SESSION_SECRET,
  //       resave: false,
  //       saveUninitialized: true,
  //       store: new (require('express-mysql-session')(session))(bookshelf.knex.client.config.connection),
  //       unset: 'destroy',
  //       cookie
  //     })
  //    ()
}
app.use(
  morgan(
    ':res[X-Request-ID] :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
  )
)
app.use((req, res, next) => {
  debug(req.ip, req.method, req.url)
  next()
})

db.init()
apis.init(app)

app.use((err, req, res, next) => {
  debugE('Error in HTTP handler:', req.ip, req.protocol, req.method, req.path, err)
  res.status(500).send('Server Error!\n')
  res.end()
  next()
})

debug('version:', 'listening on ', process.env.SERVER_PORT)
app.listen(process.env.SERVER_PORT)

module.exports = {app}
