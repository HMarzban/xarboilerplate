const { checkSchema, validationResult } = require('express-validator')
const excValidation = require('../../utils').excValidation(validationResult)

const search = checkSchema({
  artistName: {
    in: ['query'],
    exists: true,
    isString: true
  }
})

module.exports = {
  search: [search, excValidation]
}
