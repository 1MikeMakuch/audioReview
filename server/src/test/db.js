/* global describe, it, before, after afterEach */

const chai = require('chai')
const db = require('../db')
const debug = require('debug')('dt:test:db')
const debugE = require('debug')('dt:error:db')
const process = require('process')
const utils = require('../utils')

chai.use(require('chai-http'))

const expect = chai.expect

before('init db', async function () {
  await db.init()
})

describe('db', async function () {
  it('comments', async function () {
    let userid = 999999999
    let mp3 = 'test000'
    let comments = 'this is a test'

    let r = await db.comments.create(userid, mp3, comments)

    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)
    let id = r.insertId

    r = await db.comments.get(mp3)
    expect(r.length).to.equal(1)
    expect(r[0].userid).to.equal(userid)
    expect(r[0].mp3).to.equal(mp3)
    expect(r[0].data).to.equal(comments)
    id = r[0].id

    // update
    comments = 'this is a test 2'
    r = await db.comments.update(id, comments)
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    // check updated
    r = await db.comments.get(mp3)
    expect(r.length).to.equal(1)
    expect(r[0].userid).to.equal(userid)
    expect(r[0].mp3).to.equal(mp3)
    expect(r[0].data).to.equal(comments)

    r = await db.comments.del(id)
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    r = null
    try {
      r = await db.comments.get(mp3)
    } catch (e) {
      debug(e.message)
    }
    expect(r.length).to.equal(0)

    r = null
    try {
      r = await db.comments.create(userid, null, comments)
      expect(false).to.equal(true)
    } catch (e) {
      debugE(e.message)
      expect(e.message).to.equal('mp3 required')
    }
    expect(r).to.be.null

    try {
      r = await db.comments.create(null, userid, comments)
      expect(false).to.equal(true)
    } catch (e) {
      debugE(e.message)
      expect(e.message).to.equal('userid required')
    }
    expect(r).to.be.null

    try {
      r = await db.comments.create(userid, mp3, null)
      expect(false).to.equal(true)
    } catch (e) {
      debugE(e.message)
      expect(e.message).to.equal('comments required')
    }
    expect(r).to.be.null
  })
  it('keyvals', async function () {
    const id0 = 'test00000000000'
    let data = 'xyzzy'

    let r = await db.keyvals.set(id0, data)

    expect(r.id).to.equal(id0)
    expect(r.data).to.equal(data)

    r = await db.keyvals.get(id0)
    expect(r.id).to.equal(id0)
    expect(r.val).to.equal(data)

    let id1 = 'test9999999999999999'
    r = null
    try {
      r = await db.keyvals.get(id1)
    } catch (e) {
      expect(false).to.be.true
    }
    expect(r).to.be.undefined

    try {
      r = await db.keyvals.set(null, data)
      expect(false).to.be.true
    } catch (e) {
      expect(e.message).to.equal('id required')
    }
    expect(r).to.be.undefined

    try {
      r = await db.keyvals.set(id1, null)
      expect(false).to.be.true
    } catch (e) {
      expect(e.message).to.equal('val required')
    }
    expect(r).to.be.undefined

    try {
      r = await db.keyvals.del(null)
    } catch (e) {
      expect(e.message).to.equal('id required')
    }
    expect(r).to.be.undefined

    try {
      r = await db.keyvals.del(id0)
    } catch (e) {
      expect(false).to.equal(true)
    }
    expect(r.affectedRows).to.equal(1)

    r = null
    try {
      r = await db.keyvals.get(id0)
      expect(false).to.be.true
    } catch (e) {
      //
    }
    expect(r).to.be.undefined
  })

  it('likes', async function () {
    let userid = 999
    let mp3 = utils.generateRandomString(10)

    // like 1 mp3
    r = await db.likes.set(userid, mp3)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(1)

    // like it again count is still 1
    r = await db.likes.set(userid, mp3)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(1)

    // like same mp3 different user count is 2
    userid = 998
    r = await db.likes.set(userid, mp3)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(2)

    // delete 1 of them
    r = await db.likes.del(mp3, 999)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(1)

    // delete 2nd
    r = await db.likes.del(mp3, 998)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(0)

    // should be 0
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(0)

    // now create 2 and delete with 1 del call
    userid = 999
    r = await db.likes.set(userid, mp3)
    userid = 998
    r = await db.likes.set(userid, mp3)

    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(2)

    // delete both with 1 del()
    r = await db.likes.del(mp3)
    r = await db.likes.get(mp3)
    expect(r.likes).to.equal(0)
  })

  it('users', async function () {
    let user = {
      name: 'Joe User',
      email: 'joe@testuserexample.xyz'
    }

    // create

    user = await db.users.create(user)

    let id = user.id

    // read
    r = await db.users.get({id})
    expect(r.id).to.equal(id)
    expect(r.email).to.equal(user.email)
    expect(r.name).to.equal(user.name)

    // update by id
    user.email = 'xyzzy@plugh.xyz'
    r = await db.users.update({id, email: user.email})
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    // confirm it was updated
    r = await db.users.get({id})
    expect(r.id).to.equal(id)
    expect(r.email).to.equal(user.email)
    expect(r.name).to.equal(user.name)

    // update by email
    user.name = 'Sally User'
    r = await db.users.update({id, name: user.name})
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    // confirm it was updated read by email
    r = await db.users.get({email: user.email})
    expect(r.id).to.equal(id)
    expect(r.email).to.equal(user.email)
    expect(r.name).to.equal(user.name)

    let user0 = Object.assign({}, user)

    // create 1 more
    let user1 = Object.assign({}, user)
    user1.email = 'plugh@xyzzy.xyz'
    user1 = await db.users.create(user1)

    // getUsers
    let users = await db.users.select()

    expect(users.length).to.be.gt(1)

    // delete
    r = await db.users.del({id: user0.id})
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    // confirm it was deleted
    r = await db.users.get({id: user0.id})
    expect(r).to.be.undefined

    // delete by email
    r = await db.users.del({email: user1.email})
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

    // confirm it was deleted
    r = await db.users.get({email: user1.email})
    expect(r).to.be.undefined
  })
})
