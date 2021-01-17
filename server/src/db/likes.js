'use strict'

const debug = require('debug')('dt:db:likes')
const debugE = require('debug')('dt:error::db:likes')
const _ = require('lodash')

var mysql

async function get(mp3, userid) {
  if (!mp3) {
    throw new Error('mp3 required')
  }

  let sql = 'select count(mp3) as likes from likes where mp3 = ?'
  let values = [mp3]
  if (userid) {
    sql += ' and userid = ?'
    values.push(userid)
  }

  let r = await mysql(sql, values)
  return r[0]
}

async function set(userid, mp3) {
  if (!userid) {
    throw new Error('userid required')
  }

  if (!mp3) {
    throw new Error('mp3 required')
  }

  let sql = 'insert ignore into likes (userid,mp3) values (?, ?)'
  let values = [userid, mp3]

  let r = await mysql(sql, values)
  return r
}

async function del(mp3, userid) {
  if (!mp3) {
    throw new Error('mp3 required')
  }
  let sql = 'delete from likes where  mp3 = ?'
  let values = [mp3]
  if (userid) {
    sql += ' and userid = ?'
    values.push(userid)
  }

  return await mysql(sql, values)
}

async function init(config) {
  debug('init')
  mysql = config.execute
}

module.exports = {init, get, set, del}
