const app = require('express')()
const { userAuth } = require('../../middleware/middleware')
const Projects = require('./project.router')

app.use('/projects', userAuth, Projects)

module.exports = app
