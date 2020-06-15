const { checkSchema, validationResult } = require("express-validator")
const excValidation = require("../../utils").excValidation(validationResult)

const updateProfile = checkSchema({
	phone: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	name: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	userName: {
		in: ["body"],
		isString: true,
		optional: true,
	},
	email: {
		in: ["body"],
		isEmail: true,
		optional: true,
		isString: true,
	},
	password: {
		exists: false,
	},
})

module.exports = {
	updateProfile: [updateProfile, excValidation],
}
