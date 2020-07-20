const { checkSchema, validationResult } = require('express-validator')
const excValidation = require('../../utils').excValidation(validationResult)

const check = checkSchema({
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  }
})

const signup = checkSchema({
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    isLength: {
      options: { min: 5 }
    }
  },
  code: {
    in: ['body'],
    optional: true,
    isString: true
  },
  hashedCode: {
    in: ['body'],
    exists: true,
    isString: true
  },
  name: {
    in: ['body'],
    exists: true,
    isString: true
  }
})

const login = checkSchema({
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    isLength: {
      options: { min: 5 }
    }
  }
})

const otpLogin = checkSchema({
  code: {
    in: ['body'],
    exists: true,
    isString: true
  },
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  },
  password: {
    in: ['password'],
    exists: true,
    isString: true,
    isLength: {
      options: { min: 5 }
    }
  }
})

const forgetPassword = checkSchema({
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  }
})

const resetPassword = checkSchema({
  phone: {
    in: ['body'],
    exists: true,
    isString: true
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    isLength: {
      options: { min: 5 }
    }
  },
  code: {
    in: ['body'],
    exists: true,
    isString: true
  },
  hashedCode: {
    in: ['body'],
    exists: true,
    isString: true
  }
})

module.exports = {
  check: [check, excValidation],
  signup: [signup, excValidation],
  login: [login, excValidation],
  otpLogin: [otpLogin, excValidation],
  forgetPassword: [forgetPassword, excValidation],
  resetPassword: [resetPassword, excValidation]
}
