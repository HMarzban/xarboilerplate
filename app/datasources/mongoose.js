const mongoose = require('mongoose')
const debug = require('debug')('db:mongoose')
const path = require('path')
const find = require('find')

const { MONGODB_URL } = process.env

const findAllModels = () => {
  return new Promise(resolve => {
    find.file(/model.js$/, './app', function (files) {
      const data = files.map(file => {
        return require(path.resolve(file))
      })
      resolve(data)
    })
  })
}

const ensureIndexes = async () => {
  const models = await findAllModels()
  await Promise.all(models.map(model => model.syncIndexes()))
  return true
}

module.exports.connect = async mongodbURL => {
  try {
    await mongoose.connect(mongodbURL || MONGODB_URL, { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true, useFindAndModify: false })
    mongoose.connection.on('error', err => debug('connection/model error =>', err))
    await ensureIndexes()
    debug(`Connected to database on Worker process: ${process.pid}, ${mongodbURL || MONGODB_URL}`)
    // console.info(`Connected to database on Worker process: ${process.pid}`)
  } catch (error) {
    debug(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
    // console.error(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
    process.exit(1)
  }
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
}

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}
