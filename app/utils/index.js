const PHONE_REGEX = /^\+?(98)?0?(9\d{9})$/g

const validatePhone = phone => {
	if (!phone.match(PHONE_REGEX)) throw new Error({ code: "BAD_PHONE", _detail: { phone }, _msg: "phone number is not valid", _innerException: null })
	return phone.replace(PHONE_REGEX, "98$2")
}

const excValidation = validationResult => {
	return (req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(422).json({ Success: false, Error: errors.array() })
		next()
	}
}

module.exports = {
	excValidation,
	router: require("./router"),
	...require("./q2ma"),
	validatePhone,
}
