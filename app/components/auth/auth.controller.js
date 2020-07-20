const Utils = require('../../utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PHONE_CODE_SALT, SALTROUNDS, IS_PROD, JWT_TOKEN } = process.env

// Helper
const Code = {
  create: _ =>
    String(Math.random())
      .replace(/^0\.0*/, '')
      .slice(0, 4),
  hash: code => bcrypt.hashSync(`${PHONE_CODE_SALT}${code}`, +SALTROUNDS),
  verify: (hashedCode, code) => bcrypt.compareSync(`${PHONE_CODE_SALT}${code}`, hashedCode)
}

const isPhoneDummy = phone => /^98940/.test(phone)
const DUMMY_CODE = '9983'

/**
 * @param {String} templateName
 * @param {Object} phone
 * @param {Boolean} registered
 */
const createAndsendHashCode = async (templateName, { phone }, registered = false) => {
  const code = isPhoneDummy(phone) ? DUMMY_CODE : Code.create()
  const hashCode = Code.hash(code)
  const result = { hashedCode: hashCode, registered }
  if (IS_PROD === 'true') {
    // Notify service must implement
    // Notify.text(templateName, phone, { code })
  } else Object.assign(result, { code })
  return result
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 */
const check = async (Users, phone) => {
  phone = Utils.validatePhone(phone)
  const user = await Users.findOne({ phone }).lean()
  if (user) return { registered: true }

  return createAndsendHashCode('signUp', { phone })
}

/**
 *
 * @param {Object} User user mongodb collection
 * @param {String} phone
 */
const otpCheck = async (Users, phone) => {
  phone = Utils.validatePhone(phone)
  let registered = false

  const user = await Users.findOne({ phone }).lean()
  if (user) registered = true

  return createAndsendHashCode('signUp', { phone }, registered)
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 * @param {String} password
 * @param {String} code
 * @param {String} hashedCode
 * @param {String} name
 */
const signup = async (Users, phone, password, code, hashedCode, name) => {
  phone = Utils.validatePhone(phone)

  const findUser = await Users.findOne({ phone }).lean()
  if (findUser) return { code: 'USER_FOUND', Message: 'user already signup.' }
  if (!Code.verify(hashedCode, code)) throw new Error({ code: 'BAD_CODE' })

  phone = Utils.validatePhone(phone)

  const newUser = { phone }

  if (name) newUser.name = name
  if (password) newUser.password = password
  const user = await Users.create(newUser)
  delete user.password
  const token = jwt.sign({ ...user._doc }, JWT_TOKEN)
  return { token }
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 * @param {String} password
 */
const login = async (Users, phone, password) => {
  phone = Utils.validatePhone(phone)
  const user = await Users.findOne({ phone }).lean()
  if (!user) return createAndsendHashCode('signUp', user)

  if (!bcrypt.compareSync(password, user.password)) throw new Error({ message: 'invalid user credentials', code: 'BAD_PASS' })
  delete user.password
  const token = jwt.sign({ ...user }, JWT_TOKEN)
  return { loggedIn: true, token }
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 * @param {String} hashedCode
 * @param {String} code
 */
const otpLogin = async (Users, phone, hashedCode, code) => {
  phone = Utils.validatePhone(phone)

  if (!Code.verify(hashedCode, code)) throw new Error({ code: 'BAD_CODE' })

  const user = await Users.findOne({ phone }, Users.PROJECT.TOKEN).lean()
  const token = jwt.sign({ ...user }, JWT_TOKEN)
  return { token }
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 */
const forgetPassword = async (Users, phone) => {
  phone = Utils.validatePhone(phone)
  const user = await Users.findOne({ phone }).lean()
  if (!user) throw new Error({ Message: 'user not found', code: 'USER_NOT_FOUND' })
  return createAndsendHashCode('forgetPass', user, true)
}

/**
 *
 * @param {Object} Users user mongodb collection
 * @param {String} phone
 * @param {String} code
 * @param {String} password
 * @param {String} hashedCode
 */
const resetPassword = async (Users, phone, code, password, hashedCode) => {
  phone = Utils.validatePhone(phone)
  const user = await Users.findOne({ phone }).lean()
  if (!user) throw new Error({ code: 'USER_NOT_FOUND' })

  if (!Code.verify(hashedCode, code)) throw new Error({ code: 'BAD_CODE', Message: 'wrong code.' })

  password = bcrypt.hashSync(password, +SALTROUNDS)
  const refreshUser = await Users.findOneAndUpdate({ phone }, { $set: { password } }, { projection: Users.PROJECT.TOKEN }).lean()
  const token = jwt.sign({ ...refreshUser }, JWT_TOKEN)
  return { loggedIn: true, token }
}

module.exports = {
  check,
  signup,
  login,
  forgetPassword,
  resetPassword,
  otpLogin,
  otpCheck
}
