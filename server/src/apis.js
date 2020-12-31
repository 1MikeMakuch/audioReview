'use strict'
console.log('apis.js loaded by server.js!!!')

//const utils = require('./utils')

const db = require('./db')

const debug = require('debug')('dt:apis')
const debugE = require('debug')('dt:error::apis')
require('dotenv').config()

var mysql

function health(req, res) {
  debug(req.method, req.originalUrl)
  res.status(200).send('Healthy\n')
  res.end()
}
async function getComments(req, res) {
  let id = req.params.id

  if (!id) {
    return res.status(404)
  }

  let results

  try {
    results = await db.comments.get(id)
  } catch (e) {
    debugE(e)
    res.status(404).end()
  }
  res.json(results)
}
async function postComments(req, res) {
  debug('post', req.params, req.body)
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
    result = await db.comments.post(userid, id, comments)
  } catch (e) {
    debugE(e)
    res.status(400)
  }
  if (result) {
    res.status(400)
  } else {
    res.status(201)
  }
  res.end()
}
async function getKeyVals(req, res) {
  let id = req.params.id

  if (!id) {
    return res.status(404)
  }

  let result

  try {
    result = await db.keyvals.get(id)
  } catch (e) {
    debugE(e)
    res.status(404).send(e)
  }

  res.json(result)
}
async function postKeyVals(req, res) {
  debug('post', req.headers['content-type'], req.params, req.body)

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
    result = await db.keyvals.post(id, data)
  } catch (e) {
    debugE(e)
    res.status(400)
  }
  debug('result', result)
  if (result) {
    res.status(404)
  } else {
    res.status(201)
  }
  res.end()
}
function init(app) {
  debug('init')
  app.get('/healthz', health)
  app.get('/comments/:id', getComments)
  app.post('/comments/:id/:userid', postComments)
  app.get('/keyvals/:id', getKeyVals)
  app.post('/keyvals/:id', postKeyVals)
  app.put('/keyvals/:id', postKeyVals)
}

module.exports = {init}
