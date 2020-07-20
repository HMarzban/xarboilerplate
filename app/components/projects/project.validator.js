const { checkSchema, validationResult } = require('express-validator')
const excValidation = require('../../utils').excValidation(validationResult)

const createProject = checkSchema({
  projectName: {
    in: ['body'],
    exists: true,
    isString: true
  },
  description: {
    in: ['body'],
    optional: true,
    isString: true
  }
})

const updateProject = checkSchema({
  projectId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  },
  projectName: {
    in: ['body'],
    exists: true,
    isString: true
  },
  description: {
    in: ['body'],
    optional: true,
    isString: true
  }
})

const removeProject = checkSchema({
  projectId: {
    in: ['params'],
    isMongoId: true,
    exists: true
  }
})

module.exports = {
  createProject: [createProject, excValidation],
  updateProject: [updateProject, excValidation],
  removeProject: [removeProject, excValidation]
}
