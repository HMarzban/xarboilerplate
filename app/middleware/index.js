const app = require("express")()
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const morgan = require("morgan")
const helmet = require("helmet")
const chalk = require("chalk")

app.use(morgan(`${chalk.green("[morgan]")} :method :url :status - :response-time ms`))

app.use(helmet())

app.use((req, res, next) => {
	const queryString = req.url.split("?")[1] || ""
	req.queryString = queryString
	next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload({ createParentPath: true, limits: { fileSize: 2 * 1024 * 1024 } }))

module.exports = app
