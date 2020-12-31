'use strict'

const mysql = require('mysql2/promise')
require('dotenv').config()

async function mysqlConnect() {
  let config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
  console.log(JSON.stringify(config, null, 2))
  return await mysql.createConnection(config)

  //   return new Promise(async (resolve, reject) => {
  //     console.log('about to createConnect')
  //     return await mysql.createConnection(config)
  //     console.log('after createConnect')
  //     con.connect(function(err) {
  //       console.log('after connect')
  //       if (err) throw err
  //       return resolve(con)
  //     })
  //   })
}
async function doit() {
  let db = await mysqlConnect()
  console.log('about to query db')
  let [rows, fields] = await db.query('select * from comments')
  console.log(JSON.stringify({rows}, null, 2))
  db.close()
}
doit()
