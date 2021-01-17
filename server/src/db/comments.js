'use strict'

const debug = require('debug')('dt:db:comments')
//const debugE = require('debug')('dt:error::db:comments')

var mysql

async function get(id) {
  if (!id) {
    throw new Error('id required')
  }
  let sql = 'select * from comments where mp3 = ? order by dt'
  return await mysql(sql, [id])
}
async function create(userid, mp3, comments) {
  if (!mp3) {
    throw new Error('mp3 required')
  }
  if (!userid) {
    throw new Error('userid required')
  }
  if (!comments) {
    throw new Error('comments required')
  }
  let sql = 'insert into comments (userid,mp3,data) values (?, ?, ?)'
  let values = [userid, mp3, comments]

  return await mysql(sql, values)
}
async function update(id, data) {
  if (!id && 0 !== id) throw new Error('id required')
  if (!data) throw new Error('comments required')
  let sql = 'update comments set data = ? where id = ?'
  let values = [data, id]
  return await mysql(sql, values)
}
async function del(id) {
  if (!id) {
    throw new Error('id required')
  }
  let sql = 'delete from comments where id= ?'
  let values = [id]
  return await mysql(sql, values)
}

async function init(config) {
  debug('init', Object.keys(config))
  mysql = config.execute
}

module.exports = {init, get, create, update, del}
