const app = require("express")()
const { userAuth } = require("../../middleware/middleware")
const Tasks = require("./tasks.router")

app.use("/tasks", userAuth, Tasks)

module.exports = app
