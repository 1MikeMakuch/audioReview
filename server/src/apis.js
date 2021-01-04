'use strict'
console.log('apis.js loaded by server.js!!!')

const utils = require('./utils')
const db = require('./db')
const debug = require('debug')('dt:apis')
const debugE = require('debug')('dt:error::apis')
const _ = require('lodash')
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
// const BearerStrategy = require('passport-http-bearer')

require('dotenv').config()

var mysql

function health(req, res) {
  res.status(200).send('Healthy\n')
  res.end()
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
function init(app) {
  debug('init')
  //   app.use(passport.initialize())
  //   app.use(passport.session())

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
}

module.exports = {init}
