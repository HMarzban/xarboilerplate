const app = require('express')()
const Auth = require('./auth.router')

app.use('/auth', Auth)

module.exports = app
