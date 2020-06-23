const path = require("path")
const debug = require("debug")("x-router")

function createRoute(method, responseHandler, expressRouter) {
	return (routePath, ...callbacks) => {
		const lastCallback = callbacks.pop()
		expressRouter[method](routePath, ...callbacks, (req, res) => {
			const result = typeof lastCallback === "function" ? lastCallback(req, res) : lastCallback
			// most of the time result is a promise, but we also support literal values in response handlers.
			if (!res.headersSent) responseHandler(req, res, result)
			else debug("WARNING FOR DEVELOPER: use express router directly if you want to handle response yourself.")
		})
	}
}

async function APIHandler(req, res, result) {
	try {
		// whether result is a promise or a literal value, await will get the literal value.
		const Result = await result
		res.send({ Success: true, Result })
	} catch (error) {
		debug(error)
		let Error = error
		if (process.env.NODE_ENV !== "local") {
			const { code } = error.code || {}
			Error = { code: code || "UNHANDLED" }
		}
		res.status(400).send({ Success: false, Error })
	}
}

async function fileHandler(req, res, result) {
	try {
		// whether result is a promise or a literal value, await will get the literal value.
		const filePath = await result
		if (typeof filePath === "string" && filePath.includes("/")) {
			if (process.env.NODE_ENV) {
				res.set("X-Accel-Redirect", path.join("/uploads", filePath)).send()
			} else {
				res.sendFile(filePath, { root: path.join(process.env.UPLOAD_ROOT) }, err => {
					if (err) res.status(404).send(err)
				})
			}
		} else {
			res.status(404).send()
		}
	} catch (ex) {
		res.status(404).send()
	}
}

module.exports = function () {
	const expressRouter = require("express").Router()
	return {
		get: createRoute("get", APIHandler, expressRouter),
		post: createRoute("post", APIHandler, expressRouter),
		patch: createRoute("patch", APIHandler, expressRouter),
		put: createRoute("put", APIHandler, expressRouter),
		delete: createRoute("delete", APIHandler, expressRouter),
		file: createRoute("get", fileHandler, expressRouter),
		expressRouter,
	}
}
