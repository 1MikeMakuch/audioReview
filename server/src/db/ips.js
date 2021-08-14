'use strict'

const debug = require('debug')('dt:db:ips')
const debugE = require('debug')('dt:error::db:ips')
const _ = require('lodash')

var mysql

async function get(email) {
  if (!email) {
    throw new Error('email required')
  }

  let sql = 'select ip  from ips where email = ?'
  let values = [email]
  let r = await mysql(sql, values)
  return r[0]
}

async function set(email, ip) {
  if (!email) {
    throw new Error('email required')
  }

  if (!ip) {
    throw new Error('pp required')
  }

  let sql = 'insert into ips (email,ip) values (?, ?) on duplicate key update ip = ? '
  let values = [email, ip, ip]

  let r = await mysql(sql, values)
  return r
}

async function init(config) {
  debug('init')
  mysql = config.execute
}

module.exports = {init, get, set}
