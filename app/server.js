process.env.NODE_ENV = process.env.NODE_ENV || 'local'
require('dotenv-flow').config({ silent: true })

const db = require('./datasources')
const app = require('./app')

;(async () => {
  await db.connect()

  await app.init()
})()
