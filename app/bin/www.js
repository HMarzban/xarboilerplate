const app = require("express")()
const http = require("http")
const chalk = require("chalk")
const debug = require("debug")("http")
const { PORT, NODE_ENV } = process.env

app.set("port", PORT)

function onError(error) {
	if (error.syscall !== "listen") throw error

	const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			debug(bind + " requires elevated privileges")
			process.exit(1)
		case "EADDRINUSE":
			debug(bind + " is already in use")
			process.exit(1)
		default:
			throw error
	}
}

const use = (...arg) => {
	if (arg.length) app.use(...arg)
}

const init = () => {
	return new Promise(resolve => {
		const server = http.createServer(app)
		server.listen(PORT)
		server.on("error", onError)
		server.on("listening", () => {
			const addr = server.address()
			const address = addr.address === "::" ? chalk.bold.underline.yellow(`http://localhost:${addr.port}`) : chalk.bold.underline.yellow(`${addr.address}:${addr.port}`)
			debug(`Server started on Port ${chalk.blue.yellow(PORT)} , NODE_ENV: ${chalk.blue.yellow(NODE_ENV)}, Access to Project: ${address} (ctrl+click)`)
			resolve(true)
		})
	})
}

module.exports = {
	express: app,
	use,
	init,
}
