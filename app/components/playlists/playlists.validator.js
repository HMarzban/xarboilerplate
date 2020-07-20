const { checkSchema, validationResult } = require('express-validator')
const excValidation = require('../../utils').excValidation(validationResult)

const createPlayList = checkSchema({
  title: {
    in: ['body'],
    exists: true,
    isString: true
  },
  track: {
    in: ['body'],
    exists: true,
    isEmpty: false
  }
})

const updatePlayList = checkSchema({
  track: {
    in: ['body'],
    exists: true,
    isEmpty: false
  }
})

const removePlayList = checkSchema({
  playListId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  }
})

module.exports = {
  createPlayList: [createPlayList, excValidation],
  updatePlayList: [updatePlayList, excValidation],
  removePlayList: [removePlayList, excValidation]
}
