'use strict'

const debug = require('debug')('dt:db')
const debugE = require('debug')('dt:error:db')
const mysqlPromise = require('mysql2/promise')
require('dotenv').config()

const comments = require('./comments')
const keyvals = require('./keyvals')
//const users = require('./users')

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
}

async function init() {
  debug('init')
  await mysqlConnect()
  comments.init({mysql})
  keyvals.init({mysql})
}

module.exports = {init, comments, keyvals}
