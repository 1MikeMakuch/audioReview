'use strict'

const debug = require('debug')('dt:db')
const debugE = require('debug')('dt:error:db')
const mysqlPromise = require('mysql2/promise')
require('dotenv').config()

const comments = require('./comments')
const keyvals = require('./keyvals')
const users = require('./users')
const likes = require('./likes')
const ips = require('./ips')

var mysql

async function mysqlConnect() {
  let config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: '+00:00'
  }
  debug(JSON.stringify(config))
  mysql = await mysqlPromise.createConnection(config)
  let [v] = await mysql.query('show variables like "version"')
  let [z] = await mysql.query('show variables like "%zone%"')
  debug(JSON.stringify([v, z]))
  return {mysql, options: config}
}

async function execute(sql, values) {
  let results
  try {
    ;[results] = await mysql.execute(sql, values)
  } catch (e) {
    debugE(sql, JSON.stringify(values), e.message)
    throw e
  }
  debug(sql, JSON.stringify({values, results: results}))
  return results
}

async function init() {
  debug('init')
  let c = await mysqlConnect()
  comments.init({execute})
  keyvals.init({execute})
  users.init({execute})
  likes.init({execute})
  ips.init({execute})
  return c
}

module.exports = {init, comments, keyvals, users, likes, ips}
