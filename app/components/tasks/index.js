const app = require("express")()
const { userAuth } = require("../../middleware/auth.middelware")
const Tasks = require("./tasks.router")

app.use("/tasks", userAuth, Tasks)

module.exports = app
