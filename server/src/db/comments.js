'use strict'

const debug = require('debug')('dt:db:comments')
const debugE = require('debug')('dt:error::db:comments')

var mysql

async function get(id) {
  if (!id) {
    throw new Error('id required')
  }
  let sql = 'select * from comments where mp3 = ? order by dt'
  let results
  try {
    ;[results] = await mysql.execute(sql, [id])
  } catch (e) {
    debugE('get', sql, id, e)
    throw e
  }
  debug('get', sql, id, JSON.stringify(results))
  if (results && results.length) {
    return results
  } else {
    throw new Error(id + ' not found')
  }
}
async function create(userid, mp3id, comments) {
  if (!mp3id) {
    throw new Error('mp3id required')
  }
  if (!userid) {
    throw new Error('userid required')
  }
  if (!comments) {
    throw new Error('comments required')
  }
  let sql = 'insert into comments (userid,mp3,data) values (?, ?, ?)'
  let values = [userid, mp3id, comments]
  debug('create', sql, JSON.stringify(values))
  let results
  try {
    results = await mysql.execute(sql, values)
  } catch (e) {
    debugE(e)
    throw e
  }
  debug('results', JSON.stringify(results))

  return results
}
async function del(id) {
  if (!id) {
    throw new Error('id required')
  }

  let sql = 'delete from comments where id= ?'
  let values = [id]
  debug('del', sql, JSON.stringify(values))
  let results
  try {
    results = await mysql.execute(sql, values)
  } catch (e) {
    debugE(e)
    throw e
  }

  return results
}

async function init(config) {
  debug('init', Object.keys(config))
  mysql = config.mysql
}

module.exports = {init, get, create, del}
