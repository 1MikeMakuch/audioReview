/* global describe, it, before, after afterEach */

const process = require('process')
const chai = require('chai')
const db = require('../db')
const debug = require('debug')('dt:test:db')
const debugE = require('debug')('dt:error:db')

chai.use(require('chai-http'))

const expect = chai.expect

before('init db', async function() {
  await db.init()
})

describe('db', async function() {
  it('comments', async function() {
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
      expect(e.message).to.equal('mp3id required')
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
  it('keyvals', async function() {
    const id0 = 'test00000000000'
    let data = 'xyzzy'
    let r
    try {
      r = await db.keyvals.set(id0, data)
    } catch (e) {
      //
    }
    expect(r.affectedRows).to.equal(1)
    expect(r.warningStatus).to.equal(0)

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
})
