const mongoose = require("mongoose")
const router = require("../../utils").router()
const Auth = require("./auth.controller")
const valid = require("./auth.validator")
const Users = mongoose.models.profiles

router.get("/healthCheck", "Ok")

router.post("/check", valid.check, (req, res) => {
	const { phone } = req.body
	return Auth.check(Users, phone)
})

router.post("/otp-check", valid.check, (req, res) => {
	const { phone } = req.body
	return Auth.otpCheck(Users, phone)
})

router.post("/signup", valid.signup, (req, res) => {
	const { phone, password, code, hashedCode, name } = req.body
	return Auth.signup(Users, phone, password, code, hashedCode, name)
})

router.post("/login", valid.login, (req, res) => {
	const { phone, password } = req.body
	return Auth.login(Users, phone, password)
})

router.post("/otp-login", valid.otpLogin, (req, res) => {
	const { phone, hashedCode, code } = req.body
	return Auth.otpLogin(Users, phone, hashedCode, code)
})

router.post("/forget-password", valid.forgetPassword, (req, res) => {
	const { phone } = req.body
	return Auth.forgetPassword(Users, phone)
})

router.post("/reset-password", valid.resetPassword, (req, res) => {
	const { phone, code, password, hashedCode } = req.body
	return Auth.resetPassword(Users, phone, code, password, hashedCode)
})

module.exports = router.expressRouter
