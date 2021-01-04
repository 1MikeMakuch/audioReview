const nodeMailer = require('nodemailer')
const crypto = require('crypto')
const debug = require('debug')('dt:utils')
const debugE = require('debug')('dt:error:utils')

// https://cloud.google.com/compute/docs/tutorials/sending-mail/
// https://support.google.com/a/answer/2956491 (fyi, leadporte.com domain is being managed by NameCheap)
let mailConfig
exports.mailInit = function() {
  mailConfig = {
    port: 587,
    host: process.env.MAIL_HOST,
    requireTLS: true
  }
  if (process.env.MAIL_USER) {
    mailConfig = {
      port: process.env.MAIL_PORT,
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }
  }

  debug('mail config', JSON.stringify(exports.hidePW(mailConfig)))
  exports.mailTransporter = nodeMailer.createTransport(mailConfig)
}

exports.sendMailPromise = function(data) {
  return new Promise((resolve, reject) => {
    exports.mailTransporter.sendMail(data, (error, info) => {
      debug('sendMail data:', JSON.stringify({from: data.from, to: data.to, subject: data.subject, body: data.text}))
      if (error) debugE('sendMail error:', JSON.stringify(error))
      if (info) debug('sendMail info:', JSON.stringify(info))
      if (!error) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
exports.sendMailRetry = async function(data) {
  const tries = 10
  var i = 0
  var seconds = 2

  for (i = 0; i < tries; i++) {
    try {
      await exports.sendMailPromise(data)

      break
    } catch (e) {
      debugE('sendMail fail, try:', i, 'seconds', seconds, data.to, exports.stringify(e))
    }

    await new Promise(resolve => setTimeout(resolve, seconds * 1000))
    seconds *= 2
  }
  debug('sendMail success', data.to, 'tries:', i, 'seconds', seconds)
}
exports.sendMail = function(data, callback) {
  setTimeout(() => exports.sendMailRetry(data), 0)
  if (callback) callback()
}

exports.generateRandomString = function(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

  return Array(length)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
}

// TODO: rename to generateEncryptedString
exports.generateEncryptedApiToken = function() {
  return exports.encryptApiToken(exports.generateRandomString(32))
}
exports.encryptString = function(decryptedString) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.APP_KEY)
  const encryptedString = cipher.update(decryptedString, 'utf8', 'hex') + cipher.final('hex')
  debug('encryptString', decryptedString, encryptedString)
  return encryptedString
}
exports.decryptString = function(encryptedString) {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.APP_KEY)
  let decryptedString = decipher.update(encryptedString, 'hex', 'utf8') + decipher.final('utf8')
  debug('decryptedString', encryptedString, decryptedString)
  return decryptedString
}

// TODO: rename to encryptString
exports.encryptApiToken = function(apiToken) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.APP_KEY)
  return cipher.update(apiToken, 'utf8', 'hex') + cipher.final('hex')
}
// TODO: rename to decryptString
exports.decryptApiToken = function(encryptedApiToken) {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.APP_KEY)
  let decryptedApiToken = decipher.update(encryptedApiToken, 'hex', 'utf8') + decipher.final('utf8')
  debug('decryptApiToken', encryptedApiToken, decryptedApiToken)
  return decryptedApiToken
}

exports.numberWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

exports.escapeWithoutQuotes = function(value) {
  return mysql.escape(value).slice(1, -1)
}

exports.escapeWithQuotes = function(value, likeClause = false) {
  if (likeClause)
    return (
      "'%" +
      exports.escapeWithoutQuotes(
        value
          .replace(/\\/g, '\\\\')
          .replace(/_/g, '\\_')
          .replace(/%/g, '\\%')
      ) +
      "%'"
    )
  // https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-and-operators#comparison-operators
  else return mysql.escape(value)
}

exports.getProp = function(defaultValue, object, ...restArgs) {
  // Convenience method for getting nested properties

  function coerceType(value) {
    const defaultType = typeof defaultValue
    const valueType = typeof value
    if ('number' === defaultType && 'string' === valueType) {
      const n = Number(value)
      if (isNaN(n)) {
        return value
      } else {
        return n
      }
    } else if ('boolean' === defaultType && 'string' === valueType) {
      if ('true' === value) {
        return true
      } else if ('false' == value) {
        return false
      }
      return value
    }
    return value
  }
  var obj = object
  const l = restArgs.length
  for (var i = 0; i < l; i++) {
    var arg = restArgs[i]
    try {
      if (null === obj || typeof obj === 'undefined') {
        return defaultValue
      }
      if (Object.prototype.hasOwnProperty.call(obj, arg)) {
        obj = obj[arg]
      } else {
        return defaultValue
      }
    } catch (e) {
      debugE('misc.getProp error:', obj, arg, e)
    }
  }
  return coerceType(obj)
}
exports.hasProp = function(object, ...restArgs) {
  var obj = object
  const l = restArgs.length
  for (var i = 0; i < l; i++) {
    var arg = restArgs[i]
    try {
      if (null === obj || typeof obj === 'undefined') {
        return false
      }
      if (Object.prototype.hasOwnProperty.call(obj, arg)) {
        obj = obj[arg]
      } else {
        return false
      }
    } catch (e) {
      debugE('misc.hasProp error:', obj, arg, e)
    }
  }
  return true
}

exports.stringify = function(value) {
  // stringify for error objects
  function adapter(key, value) {
    try {
      if (value instanceof Error) {
        return {
          // Pull all enumerable properties, supporting properties on custom Errors
          ...value,
          // Explicitly pull Error's non-enumerable properties
          name: value.name,
          message: value.message,
          stack: value.stack
        }
      }
      return value
    } catch (e) {
      debugE('amply-util stringify error', e)
    }
    return value
  }
  try {
    return JSON.stringify(value, adapter)
  } catch (e) {
    debugE('amply-util stringify error', e)
  }
  return value
}
exports.debugReq = function(debugLocal, req, ...restArgs) {
  let user = req.user && req.user.id ? 'user:' + req.user.id : ''
  debugLocal(req.ip, user, req.method, req.url, 'params:' + JSON.stringify(req.params), JSON.stringify(...restArgs))
}
exports.traverse = function(obj, FUNC) {
  function traverse(object) {
    if (isArray(object)) {
      traverseArray(object)
    } else if (typeof object === 'object' && object !== null) {
      traverseObject(object)
    }
  }
  function traverseArray(arr) {
    arr.forEach(function(x) {
      traverse(x)
    })
  }
  function traverseObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        FUNC(obj, key)
        traverse(obj[key])
      }
    }
  }
  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  }
  traverse(obj)
  return obj
}
exports.hidePW = function(objIn) {
  var obj = JSON.parse(JSON.stringify(objIn))

  exports.traverse(obj, (obj, key) => {
    if ('password' === key) {
      obj.password = '*****'
    } else if ('password_confirmation' === key) {
      obj.password_confirmation = '*****'
    } else if ('pass' === key) {
      obj.pass = '*****'
    }
  })
  return obj
}
