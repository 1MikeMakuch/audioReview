/* global describe, it, before, after afterEach */

const process = require('process')
const chai = require('chai')
const db = require('../db')
const debug = require('debug')('dt:test:apis')
const debugE = require('debug')('dt:error:apis')
const utils = require('../utils')

chai.use(require('chai-http'))

const expect = chai.expect

const request = chai.request(process.env.TEST_URL)

let auth, user

async function login() {
  user = {
    name: 'Joe User',
    email: 'joe@example.com'
  }

  await db.users.del({email: user.email})

  // request login link
  debug('/api/requestLoginLink', JSON.stringify(user))
  let r = await request
    .post('/api/requestLoginLink')
    .send(user)
    .redirects(0)
  expect(r.status).to.equal(200)

  // For dev only the token is included in the body for ENV=development only, so we can grab it and use it for testing.
  debug('token', JSON.stringify(r.body))
  let token = r.body?.dev['x-dollahite-tapes-app']

  expect(String(token).length).to.be.gt(0)

  // now login with the token
  r = await request.get('/api/login?token=' + token).redirects(0)
  expect(r.status).to.equal(200)
  debug('auth cookie', r.headers['set-cookie'][0])
  let cookie = r.headers['set-cookie'][0].replace(/;.*/, '')
  auth = {cookie}
  user = r.body
  debug('user', JSON.stringify(user))
}

before('init db', async function() {
  //
  await db.init()
  await login()
})
after('cleanup', async function() {
  await db.users.del({email: user.email})
})
describe('api', async function() {
  it('isLoggedIn', async function() {
    let r = await request.get('/api/isLoggedIn').set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.id).to.equal(user.id)
  })
  it('comments', async function() {
    let userid = 999999999
    let mp3 = 'test000'
    let comments = 'this is a test'

    // create a comment
    let r = await request
      .post(`/api/comments/${mp3}/${userid}`)
      .send({comments})
      .set(auth)

    expect(r.status).to.equal(201)
    debug('comment created', r.status)

    // read it
    r = await request.get(`/api/comments/${mp3}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.be.gt(0)
    expect(r.body.find(comment => comments === comment.data).data).to.equal(comments)
    let ids = r.body.map(comment => comment.id)

    // doesn't exist
    r = await request.get(`/api/comments/${mp3}+'xyzzy123321'`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.equal(0)

    // delete

    for (var i = 0; i < ids.length; i++) {
      r = await request
        .del(`/api/comments/${ids[i]}`)

        .set(auth)
      expect(r.status).to.equal(200)
    }

    // delete doesn't exist
    r = await request.del(`/api/comments/${mp3 + 'testxyzzy123'}'`).set(auth)

    expect(r.status).to.equal(400)

    // create errors
    r = await request
      .post(`/api/comments//${userid}`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)

    r = await request
      .post(`/api/comments/xxx`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)

    r = await request
      .post(`/api/comments`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)
  })

  it('keyvals', async function() {
    let key = 'test000000'
    let val = 'xyzzy111'

    // create
    let r = await request
      .post(`/api/keyvals/${key}`)
      .set('Content-type', 'text/plain')
      .set(auth)
      .send(val)
    debug('created', key, val)
    expect(r.status).to.equal(201)

    // read it
    r = await request.get(`/api/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.val).to.equal(val)
    debug('read', key, val)

    // set val to an object
    val = {
      xyzzy: 'plugh!'
    }
    r = await request
      .post(`/api/keyvals/${key}`)
      .set('Content-type', 'application/json')
      .set(auth)
      .send(val)
    expect(r.status).to.equal(201)
    debug('set to object', key, val)

    // read it
    r = await request.get(`/api/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.val.xyzzy).to.equal(val.xyzzy)
    debug('read that', key, val)

    // Cant send numbers through chai
    val = 123
    try {
      r = await request
        .post(`/api/keyvals/${key}`)
        .set('Content-type', 'text/plain')
        .set(auth)
        .send(val)
      debug('set to number', key, val)
      expect(r.status).to.equal(201)
    } catch (e) {
      expect(e.code).to.equal('ERR_INVALID_ARG_TYPE')
    }

    // read non existent
    r = await request.get(`/api/keyvals/${key + '123123123'}`).set(auth)
    expect(r.status).to.equal(404)
    debug('read non existent')

    // delete
    r = await request.delete(`/api/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(200)
    debug('delete keyval created', key)

    // check it's gone
    r = await request.get(`/api/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(404)
    debug('check its deleted')
  })

  it('users', async function() {
    let user0 = {
      name: 'Joe User',
      email: 'joe@xyzzy.xyz'
    }

    // create user
    let r = await request
      .post('/api/users')
      .send(user0)
      .set(auth)
    expect(r.status).to.equal(201)
    expect(r.body.name).to.equal(user0.name)
    expect(r.body.emai).to.equal(user0.emai)
    user0 = Object.assign({}, r.body)
    debug('user0 created id', user0.id)

    // can't create duplicate
    r = await request
      .post('/api/users')
      .send(user0)
      .set(auth)
    expect(r.status).to.equal(400)
    debug('user didnt create', JSON.stringify(r.body))

    // read it by id
    r = await request.get(`/api/users/${user0.id}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user0.name)
    expect(r.body.emai).to.equal(user0.emai)

    // read it by email
    r = await request.get(`/api/users/?email=${user0.email}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user0.name)
    expect(r.body.emai).to.equal(user0.emai)

    // update by id
    user0.name = 'Sally User'
    r = await request
      .put(`/api/users/${user0.id}`)
      .send({name: user0.name})
      .set(auth)
    expect(r.status).to.equal(201)

    // read/verify the update by id
    r = await request.get(`/api/users/${user0.id}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user0.name)
    expect(r.body.emai).to.equal(user0.emai)

    // create 2nd user
    let user1 = Object.assign({}, user0)
    user1.email = 'joe1@example.com'
    r = await request
      .post('/api/users')
      .set(auth)
      .send(user1)

    expect(r.status).to.equal(201)
    expect(r.body.name).to.equal(user1.name)
    expect(r.body.email).to.equal(user1.email)
    user1 = Object.assign({}, r.body)
    debug('user1 created id', user1.id)

    // get all users
    r = await request.get(`/api/users`).set(auth)
    expect(r.status).to.equal(200)
    expect(Array.isArray(r.body)).is.true
    expect(r.body.find(u => u.id == user.id))
    expect(r.body.find(u => u.id == user0.id))
    expect(r.body.find(u => u.id == user1.id))

    // delete user0
    r = await request.delete(`/api/users/${user0.id}`).set(auth)
    expect(r.status).to.equal(200)
    debug('delete user', user0.id)

    // check it's gone
    r = await request.get(`/api/users/${user0.id}`).set(auth)
    expect(r.status).to.equal(404)
    debug('check its deleted')

    // delete user1
    r = await request.delete(`/api/users/${user1.id}`).set(auth)
    expect(r.status).to.equal(200)
    debug('deleted user', user1.id)

    // check it's gone
    r = await request.get(`/api/users/${user1.id}`).set(auth)
    expect(r.status).to.equal(404)
    debug('check its deleted')
  })

  it('likes', async function() {
    let userid0 = 999
    let userid1 = 998
    let mp30 = utils.generateRandomString(10)
    let mp31 = utils.generateRandomString(10)

    let r

    // like 1st
    r = await request.post(`/api/likes/${mp30}/${userid0}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.get(`/api/likes/${mp30}`)
    expect(r.body.likes).to.equal(1)

    // like 2nd
    r = await request.post(`/api/likes/${mp30}/${userid1}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.get(`/api/likes/${mp30}`)
    expect(r.body.likes).to.equal(2)

    // delete 1 at a time
    r = await request.del(`/api/likes/${mp30}/${userid0}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.get(`/api/likes/${mp30}`)
    expect(r.body.likes).to.equal(1)
    // delete 2nd
    r = await request.del(`/api/likes/${mp30}/${userid1}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.get(`/api/likes/${mp30}`)
    expect(r.body.likes).to.equal(0)

    // like 2 again and delete both in 1 del()
    r = await request.post(`/api/likes/${mp30}/${userid0}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.post(`/api/likes/${mp30}/${userid1}`).set(auth)
    expect(r.body.affectedRows).to.equal(1)
    r = await request.get(`/api/likes/${mp30}`)
    expect(r.body.likes).to.equal(2)
    r = await request.del(`/api/likes/${mp30}`).set(auth)
    expect(r.body.affectedRows).to.equal(2)
  })
})
