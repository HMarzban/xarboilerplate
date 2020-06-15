const jwt = require("jsonwebtoken")
const { JWT_TOKEN } = process.env

const adminAuth = (req, res, next) => {
	const token = req.headers["x-access-token"] || req.headers.authorization
	if (token) {
		try {
			const decode = jwt.verify(token, JWT_TOKEN)
			req.local = {}
			req.local.admin = decode
			return next()
		} catch (error) {
			return res.status(404).send({ message: "Decoding token face to an error / Token is not valid", error })
		}
	} else {
		return res.status(403).send({ message: "Auth token required" })
	}
}

const userAuth = (req, res, next) => {
	const token = req.headers["x-access-token"] || req.headers.authorization
	if (token) {
		try {
			const decode = jwt.verify(token, JWT_TOKEN)
			req.local = {}
			req.local.user = decode
			return next()
		} catch (error) {
			return res.status(404).send({ message: "Decoding token face to an error / Token is not valid", error })
		}
	} else {
		return res.status(403).send({ message: "Auth token required" })
	}
}

module.exports = {
	userAuth,
	adminAuth,
}
