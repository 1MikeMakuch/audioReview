/* global describe, it, before, after afterEach */

const process = require('process')
const chai = require('chai')
const db = require('../db')
const debug = require('debug')('dt:test:db')
const debugE = require('debug')('dt:error:db')

chai.use(require('chai-http'))

const expect = chai.expect

const request = chai.request(process.env.TEST_URL)

before('init db', async function() {
  await db.init()
})

describe('api', async function() {
  it('comments', async function() {
    let userid = 999999999
    let mp3 = 'test000'
    let comments = 'this is a test'

    // create a comment
    let r = await request.post(`/comments/${mp3}/${userid}`).send({comments})
    expect(r.status).to.equal(201)

    // read it
    r = await request.get(`/comments/${mp3}`)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.be.gt(0)
    expect(r.body.find(comment => comments === comment.data).data).to.equal(comments)
    let ids = r.body.map(comment => comment.id)

    // doesn't exist
    r = await request.get(`/comments/${mp3}+'xyzzy123321'`)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.equal(0)

    // delete

    for (var i = 0; i < ids.length; i++) {
      r = await request.del(`/comments/${ids[i]}`)
      expect(r.status).to.equal(200)
    }

    // delete doesn't exist
    r = await request.del(`/comments/${mp3 + 'testxyzzy123'}'`)
    expect(r.status).to.equal(400)

    // create errors
    r = await request.post(`/comments//${userid}`).send({comments})
    expect(r.status).to.equal(404)

    r = await request.post(`/comments/xxx`).send({comments})
    expect(r.status).to.equal(404)

    r = await request.post(`/comments`).send({comments})
    expect(r.status).to.equal(404)
  })

  it('keyvals', async function() {
    let key = 'test000000'
    let val = 'xyzzy111'

    // create
    let r = await request
      .post(`/keyvals/${key}`)
      .set('Content-type', 'text/plain')
      .send(val)
    debug('created', key, val)
    expect(r.status).to.equal(201)

    // read it
    r = await request.get(`/keyvals/${key}`)
    expect(r.status).to.equal(200)
    expect(r.body.val).to.equal(val)
    debug('read', key, val)

    // set val to an object
    val = {
      xyzzy: 'plugh!'
    }
    r = await request
      .post(`/keyvals/${key}`)
      .set('Content-type', 'application/json')
      .send(val)
    expect(r.status).to.equal(201)
    debug('set to object', key, val)

    // read it
    r = await request.get(`/keyvals/${key}`)
    expect(r.status).to.equal(200)
    expect(r.body.val.xyzzy).to.equal(val.xyzzy)
    debug('read that', key, val)

    // Cant send numbers through chai
    val = 123
    try {
      r = await request
        .post(`/keyvals/${key}`)
        .set('Content-type', 'text/plain')
        .send(val)
      debug('set to number', key, val)
      expect(r.status).to.equal(201)
    } catch (e) {
      expect(e.code).to.equal('ERR_INVALID_ARG_TYPE')
    }

    // read non existent
    r = await request.get(`/keyvals/${key + '123123123'}`)
    expect(r.status).to.equal(404)
    debug('read non existent')

    // delete
    r = await request.delete(`/keyvals/${key}`)
    expect(r.status).to.equal(200)
    debug('delete keyval created', key)

    // check it's gone
    r = await request.get(`/keyvals/${key}`)
    expect(r.status).to.equal(404)
    debug('check its deleted')
  })

  it('users', async function() {
    let user = {
      name: 'Joe User',
      email: 'joe@xyzzy.xyz'
    }

    // create user
    let r = await request.post('/users').send(user)
    expect(r.status).to.equal(201)
    let id = r.body.insertId

    // read it by id
    r = await request.get(`/users/${id}`)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)

    // read it by email
    r = await request.get(`/users/?email=${user.email}`)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)

    // update by id
    user.name = 'Sally User'
    r = await request.put(`/users/${id}`).send({name: user.name})
    expect(r.status).to.equal(201)

    // read/verify the update by id
    r = await request.get(`/users/${id}`)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)
  })
})
