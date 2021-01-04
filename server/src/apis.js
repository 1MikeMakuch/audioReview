'use strict'
console.log('apis.js loaded by server.js!!!')

const utils = require('./utils')
const db = require('./db')
const debug = require('debug')('dt:apis')
const debugE = require('debug')('dt:error::apis')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const expressValidator = require('express-validator')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// const LocalStrategy = require('passport-local').Strategy
// const BearerStrategy = require('passport-http-bearer')

require('dotenv').config()

var mysql

const loginSecretKey = 'knotL1+eshko298LHJ'
const jwtAlgorithm = 'HS256'
const jwtOptions = {
  issuer: 'localhost',
  audience: 'localhost',
  algorithm: jwtAlgorithm,
  expiresIn: '50m'
}

async function getComments(req, res) {
  let id = req.params.id

  if (!id) {
    return res.sendStatus(404)
  }

  let results

  try {
    results = await db.comments.get(id)
  } catch (e) {
    debugE(e)
    return res.sendStatus(404)
  }
  res.json(results)
}
async function postComments(req, res) {
  let userid = Number(req.params.userid)
  let id = req.params.id
  let comments = req.body.comments

  if (!id) {
    debugE('id required')
    return res
      .status(400)
      .send('id required')
      .end()
  }
  if (!userid) {
    debugE('userid required')
    return res
      .status(400)
      .send('userid required')
      .end()
  }
  if (!comments) {
    debugE('comments required')
    return res
      .status(400)
      .send('comments required')
      .end()
  }

  let result
  try {
    result = await db.comments.create(userid, id, comments)
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
    return res
      .status(400)
      .send('id required')
      .end()
  }

  if (!data) {
    debugE('data required')
    return res
      .status(400)
      .send('data required')
      .end()
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

async function getUsers(req, res) {
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
function returnError(code, desc, res) {
  debugE(code, desc)
  res
    .status(code)
    .send(desc)
    .end()
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

  res
    .status(201)
    .send(result)
    .end()
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

async function login(req, res) {
  const email = _.get(req.body, 'email')
  const name = _.get(req.body, 'name')

  debug('login', req.body)
  if (!email || !name) {
    res.sendStatus(400)
  }

  let user = await db.users.get({email})
  if (!user) {
    let r = await db.users.create({email, name})
    if (1 !== r.affectedRows || 0 !== r.warningStatus) {
      return res.sendStatus(400)
    }
    user = await db.users.get({email})
  }

  generateLoginJWT(user).then(loginToken => {
    sendAuthenticationEmail(user, loginToken)
    res.redirect('/login?check-email')
    //res.sendStatus(200)
  })
}
function sendAuthenticationEmail(user, token) {
  let text = 'Just click on this link and you will be logged in, no password required.\n\n'
  text += `https://${process.env.LOGIN_URL}?token=${token}\n\n`
  text += 'Cheers\nMike'
  let mail = {
    from: '1mikemakuch.server@gmail.com',
    replyTo: '1mikemakuch@gmail.com',
    to: user.email,
    subject: 'Dollahite Tapes Login Link',
    text
  }
  console.log('\ncurl -v  -H@/Users/mkm/curl/appjson  http://localhost:9092/login?token=' + token + '\n')
  //  utils.sendMail(mail)
}
function magicLink(req, res, next) {
  debug('magicLink', req.query)
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
  debug('authenticate 0', req.query)
  passport.authenticate(
    'jwt',
    {
      successReturnToOrRedirect: '/app',
      failureRedirect: '/login?incorrectToken=true',
      session: true
    },
    (err, user, info) => {
      debug('authenticate 1 err', err)
      debug('authenticate 2 user', JSON.stringify(user))
      debug('authenticate 3 info', info)
      debug('req.session', JSON.stringify(req.session))

      req.login(user, {session: true}, e => {
        debug('req.login', e)
        if (e) next(e)
        res.json(req.user)
        debug('req.user', JSON.stringify(req.user))
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
      debug('JwtStrategy uuid:', uuid, JSON.stringify(token))
      //      userRepository.fetch(uuid).then(user => {
      db.users.get({id: uuid}).then(user => {
        debug('db.users.get:', JSON.stringify(user))
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  )

  passport.serializeUser((user, next) => {
    debug('passport.serializeUser', user.id)
    next(null, user.id)
  })

  passport.deserializeUser((id, next) => {
    debug('passport.deserializeUser', id)
    db.users.get(id).then(user => {
      debug('passport.deserializeUser', JSON.stringify(user))
      if (user) next(null, user)
      else next(null, false)
    })
  })

  function health(req, res) {
    res.status(200).send('Healthy\n')
    res.end()
  }

  app.get('/healthz', health)
  app.get('/comments/:id', getComments)
  app.post('/comments/:id/:userid', postComments)
  app.delete('/comments/:id', delComments)

  app.get('/keyvals/:id', getKeyVals)
  app.post('/keyvals/:id', postKeyVals)
  app.put('/keyvals/:id', postKeyVals)
  app.delete('/keyvals/:id', delKeyVals)

  app.get('/users/:id?', getUsers)
  app.post('/users/', postUsers)
  app.put('/users/:id', putUsers)
  app.delete('/users/:id', delUsers)

  app.post(
    '/login',
    expressValidator
      .body('email')
      .isEmail()
      .normalizeEmail(),
    expressValidator
      .body('name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    login
  )
  app.get(
    '/login',
    (req, res, next) => {
      debug('/login', req.query)
      const {incorrectToken, token} = req.query

      if (token) {
        debug('next')
        next()
      } else {
        debug('else render login')
        res.redirect(301, '/login')
        //  {
        //           incorrectToken: incorrectToken === 'true'
        //        })
      }
    },
    debugNext0,
    (req, res, next) => {
      authenticate(req, res, next)
      //     passport.authenticate('jwt', {
      //       successReturnToOrRedirect: '/',
      //       failureRedirect: '/login?incorrectToken=true'
      //     })
    },
    debugNext1
  )
}
function debugNext0(req, res, next) {
  debug('debugNext0')
  next()
}
function debugNext1(req, res, next) {
  debug('debugNext1')
  next()
}

module.exports = {init}
