'use strict'

const debug = require('debug')('dt:db:users')
const debugE = require('debug')('dt:error::db:users')

var mysql

async function get(query) {
  if (!query.id && !query.email) {
    throw new Error('id or email required')
  }
  let prop, val
  if (query.id) {
    prop = 'id'
    val = query.id
  } else if (query.email) {
    prop = 'email'
    val = query.email
  }

  let sql = `select * from users where ${prop} = ?`
  let u = await mysql(sql, [val])
  if (u && u.length) {
    u = u[0]
  } else if (u.length === 0) {
    return undefined
  }
  return u
}
async function select(query) {
  debug('select', JSON.stringify(query))
  if (query && (query.id || query.email)) {
    debug('refer to get')
    return await get(query)
  }
  let sql = 'select * from users'
  let u = await mysql(sql)
  if (u && u.length) {
    return u
  } else if (u.length === 0) {
    return undefined
  }
}
async function create(user) {
  debug('create', user)
  if (!user && !user.email && !user.name) {
    throw new Error('email and name required')
  }
  let values = [user.email, user.name]
  let sql = 'insert into users (email,name) values (?, ?)'
  let r = await mysql(sql, values)
  user = {id: r.insertId, email: user.email, name: user.name}
  return user
}
async function update(user) {
  if (!user || !user.id) {
    throw new Error('id required')
  }
  if (!user && (!user.email || !user.name)) {
    throw new Error('email or name required')
  }
  let sql = 'update users set '
  let values = []
  if (user.email) {
    sql += 'email = ? '
    values.push(user.email)
  }
  if (user.name) {
    if (user.email) sql += ', '
    sql += 'name = ? '
    values.push(user.name)
  }
  sql += ' where id = ?'
  values.push(user.id)

  return await mysql(sql, values)
}

async function del(query) {
  if (!query.id && !query.email) {
    throw new Error('id or email required')
  }
  let prop, val
  if (query.id) {
    prop = 'id'
    val = query.id
  } else if (query.email) {
    prop = 'email'
    val = query.email
  }

  let sql = `delete from users where ${prop} = ? limit 1`
  return await mysql(sql, [val])
}

async function init(config) {
  debug('init')
  mysql = config.execute
}

module.exports = {init, create, get, update, del, select}
