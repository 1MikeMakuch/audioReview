'use strict'

const debug = require('debug')('dt:db:keyvals')
const debugE = require('debug')('dt:error::db:keyvals')

var mysql

async function get(id) {
  if (!id) {
    throw new Error('id required')
  }
  let sql = 'select * from keyvals where id = ?'
  let values = [id]
  let result
  try {
    ;[result] = await mysql.execute(sql, values)
  } catch (e) {
    debugE('get', sql, id, e)
    throw e
  }

  if (result && 1 == result.length) {
    let out = {}
    out.id = result[0].id
    if (null !== result[0].data) out.val = result[0].data.toString()
    out.dt = result[0].dt

    try {
      let tmp = JSON.parse(out.val)
      out.val = tmp
    } catch (e) {
      debugE('get', e.message)
    }
    debug('get', sql, id, JSON.stringify(out))
    return out
  } else {
    debugE('get', id + ' not found', result)
    throw new Error(id + ' not found')
  }
}
async function set(id, data) {
  if (!id) {
    throw new Error('id required')
  }

  if (!data) {
    throw new Error('val required')
  }

  let json = 0
  let obj

  try {
    json = JSON.stringify(data)
    obj = JSON.parse(json)
    let isArray = Array.isArray(obj)
    let isObject = (typeof obj === 'object' || typeof obj === 'function') && obj !== null
    json = isArray || isObject ? 1 : 0
    if (json) data = JSON.stringify(data)
  } catch (e) {
    debug('set', data, e)
    json = 0
  }

  let sql = 'insert into keyvals (id,data) values (?, ?) on duplicate key update data = ?'

  let values = [id, data, data]
  debug('set', sql, JSON.stringify(values))
  let result
  try {
    result = await mysql.execute(sql, values)
  } catch (e) {
    debugE('set', e)
    throw e
  }
  debug('set', id, JSON.stringify(data), JSON.stringify(result))
  return result
}

async function del(id) {
  if (!id) {
    throw new Error('id required')
  }

  let sql = 'delete from keyvals where id= ?'
  let values = [id]

  let results
  try {
    results = await mysql.execute(sql, values)
  } catch (e) {
    debugE('del', sql, JSON.stringify(values), e.message)
    throw e
  }
  debug('del', sql, JSON.stringify(values), JSON.stringify(results))
  return results
}
async function init(config) {
  debug('init', Object.keys(config))
  mysql = config.mysql
}

module.exports = {init, get, set, del}
