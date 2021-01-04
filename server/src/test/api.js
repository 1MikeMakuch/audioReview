/* global describe, it, before, after afterEach */

const process = require('process')
const chai = require('chai')
const db = require('../db')
const debug = require('debug')('dt:test:db')
const debugE = require('debug')('dt:error:db')

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
  let r = await request
    .post('/requestLoginLink')
    .send(user)
    .redirects(0)
  expect(r.status).to.equal(302)

  // discreetly the token is included as a custom header in ENV=development so we can grab it and avoid dealing with email
  let token = r.headers['x-dollahite-tapes-app']
  debug('token', token)
  expect(String(token).length).to.be.gt(0)

  // now login with the token
  r = await request.get('/login?token=' + token).redirects(0)
  expect(r.status).to.equal(200)
  debug('auth cookie', r.headers['set-cookie'][0])
  let cookie = r.headers['set-cookie'][0].replace(/;.*/, '')
  auth = {cookie}
}

before('init db', async function() {
  //
  await db.init()

  await login()
})
after('cleanup', async function() {
  //  await db.users.del({email: user.email})
})
describe('api', async function() {
  it('comments', async function() {
    let userid = 999999999
    let mp3 = 'test000'
    let comments = 'this is a test'

    // create a comment
    let r = await request
      .post(`/comments/${mp3}/${userid}`)
      .send({comments})
      .set(auth)

    expect(r.status).to.equal(201)
    debug('comment created', r.status)

    // read it
    r = await request.get(`/comments/${mp3}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.be.gt(0)
    expect(r.body.find(comment => comments === comment.data).data).to.equal(comments)
    let ids = r.body.map(comment => comment.id)

    // doesn't exist
    r = await request.get(`/comments/${mp3}+'xyzzy123321'`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.length).to.equal(0)

    // delete

    for (var i = 0; i < ids.length; i++) {
      r = await request
        .del(`/comments/${ids[i]}`)

        .set(auth)
      expect(r.status).to.equal(200)
    }

    // delete doesn't exist
    r = await request.del(`/comments/${mp3 + 'testxyzzy123'}'`).set(auth)

    expect(r.status).to.equal(400)

    // create errors
    r = await request
      .post(`/comments//${userid}`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)

    r = await request
      .post(`/comments/xxx`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)

    r = await request
      .post(`/comments`)

      .send({comments})
      .set(auth)
    expect(r.status).to.equal(404)
  })

  it('keyvals', async function() {
    let key = 'test000000'
    let val = 'xyzzy111'

    // create
    let r = await request
      .post(`/keyvals/${key}`)
      .set('Content-type', 'text/plain')
      .set(auth)
      .send(val)
    debug('created', key, val)
    expect(r.status).to.equal(201)

    // read it
    r = await request.get(`/keyvals/${key}`).set(auth)
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
      .set(auth)
      .send(val)
    expect(r.status).to.equal(201)
    debug('set to object', key, val)

    // read it
    r = await request.get(`/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.val.xyzzy).to.equal(val.xyzzy)
    debug('read that', key, val)

    // Cant send numbers through chai
    val = 123
    try {
      r = await request
        .post(`/keyvals/${key}`)
        .set('Content-type', 'text/plain')
        .set(auth)
        .send(val)
      debug('set to number', key, val)
      expect(r.status).to.equal(201)
    } catch (e) {
      expect(e.code).to.equal('ERR_INVALID_ARG_TYPE')
    }

    // read non existent
    r = await request.get(`/keyvals/${key + '123123123'}`).set(auth)
    expect(r.status).to.equal(404)
    debug('read non existent')

    // delete
    r = await request.delete(`/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(200)
    debug('delete keyval created', key)

    // check it's gone
    r = await request.get(`/keyvals/${key}`).set(auth)
    expect(r.status).to.equal(404)
    debug('check its deleted')
  })

  it('users', async function() {
    let user = {
      name: 'Joe User',
      email: 'joe@xyzzy.xyz'
    }

    // create user
    let r = await request
      .post('/users')
      .send(user)
      .set(auth)
    expect(r.status).to.equal(201)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)
    let id = r.body.id

    // can't create duplicate
    r = await request
      .post('/users')
      .send(user)
      .set(auth)
    expect(r.status).to.equal(400)

    // read it by id
    r = await request.get(`/users/${id}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)

    // read it by email
    r = await request.get(`/users/?email=${user.email}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)

    // update by id
    user.name = 'Sally User'
    r = await request
      .put(`/users/${id}`)
      .send({name: user.name})
      .set(auth)
    expect(r.status).to.equal(201)

    // read/verify the update by id
    r = await request.get(`/users/${id}`).set(auth)
    expect(r.status).to.equal(200)
    expect(r.body.name).to.equal(user.name)
    expect(r.body.emai).to.equal(user.emai)

    // delete
    r = await request.delete(`/users/${id}`).set(auth)
    expect(r.status).to.equal(200)
    debug('delete user', id)

    // check it's gone
    r = await request.get(`/users/${id}`).set(auth)
    expect(r.status).to.equal(404)
    debug('check its deleted')
  })
})
