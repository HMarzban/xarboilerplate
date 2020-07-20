const { checkSchema, validationResult } = require('express-validator')
const excValidation = require('../../utils').excValidation(validationResult)

const getOne = checkSchema({
  taskId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  }
})

const createTask = checkSchema({
  projectId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  },
  title: {
    in: ['body'],
    exists: true,
    isString: true
  },
  content: {
    in: ['body'],
    exists: true,
    isString: true
  },
  state: {
    in: ['body'],
    optional: true,
    isString: true
  },
  'userAssignment.name': {
    in: ['body'],
    optional: true,
    isString: true
  },
  'userAssignment.email': {
    in: ['body'],
    optional: true,
    isEmail: true
  }
})

const updateTask = checkSchema({
  taskId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  },
  title: {
    in: ['body'],
    optional: true,
    isString: true
  },
  content: {
    in: ['body'],
    optional: true,
    isString: true
  },
  state: {
    in: ['body'],
    optional: true,
    isString: true
  },
  'userAssignment.name': {
    in: ['body'],
    optional: true,
    isString: true
  },
  'userAssignment.email': {
    in: ['body'],
    optional: true,
    isEmail: true
  }
})

const removeTask = checkSchema({
  taskId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  }
})

module.exports = {
  getOne: [getOne, excValidation],
  createTask: [createTask, excValidation],
  updateTask: [updateTask, excValidation],
  removeTask: [removeTask, excValidation]
}
