const app = require("./bin/www")
const middleware = require("./middleware")

const profiles = require("./components/profiles")
const auth = require("./components/auth")
const projects = require("./components/projects")
const tasks = require("./components/tasks")

// middleware inject
app.use(middleware)
// router inject
app.use("/api/v1", [auth, tasks, projects, profiles])

module.exports = app
