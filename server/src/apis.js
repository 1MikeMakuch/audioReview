'use strict'
console.log('apis.js loaded by server.js!!!')

const utils = require('./utils')
const db = require('./db')
const debug = require('debug')('dt:apis')
const debugE = require('debug')('dt:error::apis')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const expressValidator = require('express-validator')
const {promisify} = require('util')

require('dotenv').config()

var mysql

const loginSecretKey = 'knotL1+eshko298LHJ'
const jwtAlgorithm = 'HS256'
const jwtOptions = {
  issuer: 'localhost',
  audience: 'localhost',
  algorithm: jwtAlgorithm,
  expiresIn: 15 * 60 // 15 mins
}

async function getComments(req, res) {
  let mp3 = req.params.mp3

  if (!mp3) {
    return res.sendStatus(404)
  }

  let results

  try {
    results = await db.comments.get(mp3)
  } catch (e) {
    debugE(e)
    return res.sendStatus(404)
  }
  res.json(results)
}
async function postComments(req, res) {
  let userid = req?.user?.id
  let mp3 = req?.params?.mp3
  let comments = req?.body?.comments

  if (!mp3) {
    debugE('mp3 required')
    return res.status(400).send('mp3 required').end()
  }
  if (!userid) {
    debugE('userid required')
    return res.status(400).send('userid required').end()
  }
  if (!comments) {
    debugE('comments required')
    return res.status(400).send('comments required').end()
  }
  let result
  try {
    result = await db.comments.create(userid, mp3, comments)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }

  res.sendStatus(201)
}
async function updateComments(req, res) {
  let id = parseInt(req?.params?.id)
  let comments = req?.body?.comments

  if (!id && 0 !== id) {
    debugE('id required')
    return res.status(400).send('id required').end()
  }
  if (!comments) {
    debugE('comments required')
    return res.status(400).send('comments required').end()
  }
  let result
  try {
    result = await db.comments.update(id, comments)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }

  res.sendStatus(201)
}
async function delComments(req, res) {
  let id = req.params.id

  if (!id) {
    return res.sendStatus(404)
  }

  let results

  try {
    results = await db.comments.del(id)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }
  if (results.affectedRows) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}
async function getKeyVals(req, res) {
  let id = req.params.id

  if (!id) {
    return res.sendStatus(404)
  }

  let result

  try {
    result = await db.keyvals.get(id)
  } catch (e) {
    debugE(e)
    return res.status(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)

  res.send(result)
}
async function postKeyVals(req, res) {
  let id = req.params.id
  let data = req.body

  if (!id) {
    debugE('id required')
    return res.status(400).send('id required').end()
  }

  if (!data) {
    debugE('data required')
    return res.status(400).send('data required').end()
  }

  let result
  try {
    result = await db.keyvals.set(id, data)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }

  res.sendStatus(201)
}

async function delKeyVals(req, res) {
  let id = req.params.id

  if (!id) {
    return res.sendStatus(404)
  }

  let results

  try {
    results = await db.keyvals.del(id)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }
  if (results.affectedRows) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}

async function getUser(req, res) {
  let id = _.get(req.params, 'id')
  let email = _.get(req.query, 'email')

  if (!id && !email) {
    return returnError(400, 'id or email required', res)
  }
  let query
  if (id) query = {id}
  if (email) query = {email}

  let result
  try {
    result = await db.users.get(query)
  } catch (e) {
    debugE(e)
    return res.sendStatus(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)

  res.send(result)
}
async function getUsers(req, res) {
  let result
  try {
    result = await db.users.select(req.query)
  } catch (e) {
    debugE(e)
    return res.sendStatus(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)

  res.send(result)
}
function returnError(code, desc, res) {
  debugE(code, desc)
  res.status(code).send(desc).end()
}
async function postUsers(req, res) {
  let user = {}

  let email = _.get(req.body, 'email')
  let name = _.get(req.body, 'name')

  if (!email) {
    return returnError(400, 'email required', res)
  }
  if (!name) {
    return returnError(400, 'name required', res)
  }
  user = {email, name}

  let result
  try {
    result = await db.users.create(user)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }

  res.status(201).send(result).end()
}
async function putUsers(req, res) {
  let user = {}

  let id = _.get(req.params, 'id')
  if (!id) {
    return returnError(400, 'id required', res)
  }

  let email = _.get(req.body, 'email')
  let name = _.get(req.body, 'name')

  if (!email && !name) {
    return returnError(400, 'email or name required', res)
  }
  user = {id, email, name}

  let result
  try {
    result = await db.users.update(user)
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }

  res.sendStatus(201)
}
async function delUsers(req, res) {
  let id = _.get(req, 'params.id')

  if (!id) {
    return returnError(400, 'id required', res)
  }

  let results

  try {
    results = await db.users.del({id})
  } catch (e) {
    debugE(e)
    return res.sendStatus(400)
  }
  if (results.affectedRows) {
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}

async function getLikes(req, res) {
  let mp3 = req?.params?.mp3
  let userid = req?.params?.userid

  if (!mp3) {
    return res.status(404).send('mp3id required')
  }

  let result
  try {
    result = await db.likes.get(mp3, userid)
  } catch (e) {
    debugE(e)
    return res.status(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)

  res.send(result)
}
async function setLikes(req, res) {
  let mp3 = req.params.mp3
  let userid = req?.user?.id

  if (!mp3) {
    return res.status(404).send('mp3id required')
  }
  if (!userid) {
    return res.status(404).send('userid required')
  }

  let result
  try {
    result = await db.likes.set(userid, mp3)
  } catch (e) {
    debugE(e)
    return res.status(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)
  res.send(result)
}

async function delLikes(req, res) {
  let mp3 = req.params.mp3
  let userid = req?.user?.id

  if (!mp3) {
    return res.status(404).send('mp3id required')
  }

  let result
  try {
    result = await db.likes.del(mp3, userid)
  } catch (e) {
    debugE(e)
    return res.status(404).send(e)
  }
  if (undefined === result) res.sendStatus(404)

  res.send(result)
}

const generateLoginJWT = user => {
  return new Promise((resolve, reject) => {
    return jwt.sign({sub: user.id}, loginSecretKey, jwtOptions, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

async function requestLoginLink(req, res, next) {
  //

  await new Promise(resolve => {
    expressValidator.body('email', 'valid email required').not().isEmpty().isEmail().normalizeEmail()(req, res, () =>
      resolve()
    )
  })
  await new Promise(resolve => {
    expressValidator.body('name', 'name required').not().isEmpty().trim().escape()(req, res, () => resolve())
  })

  const errors = expressValidator.validationResult(req)

  if (!errors.isEmpty()) {
    debugE('requestLoginLink', JSON.stringify(errors))
    return res.status(400).json({errors: errors.array()})
  }

  const email = _.get(req.body, 'email')
  const name = _.get(req.body, 'name')

  let user = await db.users.get({email})
  if (!user) {
    user = await db.users.create({email, name})
  }

  generateLoginJWT(user).then(loginToken => {
    sendAuthenticationEmail(user, loginToken)
    let url = process.env.UI_URL + '/login?checkEmail=1'
    let body = {dev: {'x-dollahite-tapes-app': ''}}
    if ('development' === process.env.ENVIRONMENT) {
      body = {dev: {'x-dollahite-tapes-app': loginToken}}
    }

    res.status(200)
    res.send(body).end()
  })
}

function sendAuthenticationEmail(user, token) {
  let text = 'Just click on this link and you will be logged in, no password required.\n\n'
  text += `${process.env.LOGIN_URL}?token=${token}\n\n`
  text += 'Cheers\nMike'
  let mail = {
    from: '1mikemakuch.server@gmail.com',
    replyTo: '1mikemakuch@gmail.com',
    to: user.email,
    subject: 'Vics Tapes Login Link',
    text
  }

  if ('production' == process.env.ENVIRONMENT) {
    utils.sendMail(mail)
    let mail2 = {
      from: '1mikemakuch.server@gmail.com',
      replyTo: '1mikemakuch@gmail.com',
      to: '1mikemakuch@gmail.com',
      subject: 'Vics tapes: ' + user.email + ' logged in!',
      text: user.email + ' logged in!'
    }
    utils.sendMail(mail2)
  }
}
function magicLink(req, res, next) {
  const {incorrectToken, token} = req.query

  if (token) {
    next()
  } else {
    res.render('login', {
      incorrectToken: incorrectToken === 'true'
    })
  }
}

function authenticate(req, res, next) {
  passport.authenticate(
    'jwt',
    {
      //       successReturnToOrRedirect: '/app',
      //       failureRedirect: process.env.UI_URL + '/login?incorrectToken=true',
      session: true
      //      passReqToCallback: true // doesn't seem to be needed
    },
    (err, user, info) => {
      if (!user) {
        debug('no user in token')
        return res.sendStatus(401)
        //return res.redirect(process.env.UI_URL + '/login')
      }
      req.login(user, {session: true}, e => {
        if (e) next(e)
        req.session.cookie.expires = 1000 * 86400 * 90
        res.json(req.user)
      })
    }
  )(req, res, next)
}

function init(app) {
  debug('init')

  const jwtOptions2 = {
    secretOrKey: loginSecretKey, //the same one we used for token generation
    algorithms: jwtAlgorithm, //the same one we used for token generation
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token') //how we want to extract token from the request
  }

  passport.use(
    'jwt',
    new JwtStrategy(jwtOptions2, (token, done) => {
      const uuid = token.sub

      //      userRepository.fetch(uuid).then(user => {
      db.users.get({id: uuid}).then(user => {
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  )

  passport.serializeUser((user, next) => {
    if (user && user.id) {
      next(null, user.id)
    } else {
      next(null, false)
    }
  })

  passport.deserializeUser((id, next) => {
    db.users.get({id}).then(user => {
      if (user) next(null, user)
      else next(null, false)
    })
  })

  function login(req, res, next) {
    const {incorrectToken, token} = req.query

    if (token) {
      return authenticate(req, res, next)
    } else {
      //res.redirect(301, process.env.UI_URL + '/login')
      res.sendStatus(401)
    }
  }
  function debugNext0(req, res, next) {
    debug('debugNext0')
    next()
  }
  function debugNext1(req, res, next) {
    debug('debugNext1')
    res.sendStatus(200)
  }

  function health(req, res) {
    res.status(200).send('Healthy\n')
    res.end()
  }

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      debug('isLoggedIn true!', JSON.stringify(req.user))
      return next()
    }
    let url = process.env.UI_URL + '/login'
    debug('isLoggedIn false, redirecting to ' + url)
    res.sendStatus(401)
  }

  app.get('/api/healthz', health)
  app.get('/api/comments/:mp3', getComments)
  app.post('/api/comments/:mp3', isLoggedIn, postComments)
  app.put('/api/comments/:id', isLoggedIn, updateComments)
  app.delete('/api/comments/:id', isLoggedIn, delComments)

  app.get('/api/keyvals/:id', getKeyVals)
  app.post('/api/keyvals/:id', isLoggedIn, postKeyVals)
  app.put('/api/keyvals/:id', isLoggedIn, postKeyVals)
  app.delete('/api/keyvals/:id', isLoggedIn, delKeyVals)

  app.get('/api/likes/:mp3/:userid?', getLikes)
  app.post('/api/likes/:mp3', isLoggedIn, setLikes)
  app.delete('/api/likes/:mp3', isLoggedIn, delLikes)

  app.get('/api/users/:id', isLoggedIn, getUser)
  app.get('/api/users', getUsers)
  app.post('/api/users/', isLoggedIn, postUsers)
  app.put('/api/users/:id', isLoggedIn, putUsers)
  app.delete('/api/users/:id', isLoggedIn, delUsers)

  app.post('/api/requestLoginLink', requestLoginLink)
  app.get('/api/login', login)
  app.post('/api/logout', isLoggedIn, logout)

  function logout(req, res) {
    debug('logout', req?.user?.id)
    req.logOut()
    res.sendStatus(200)
  }

  app.get('/api/isLoggedIn', isLoggedIn, (req, res) => {
    debug('isLoggedIn last step?')
    res.send(req.user)
  })
}

module.exports = {init}
