const app = require("express")()
const Profiles = require("./profiles.router")
const { userAuth } = require("../../middleware/middleware")

app.use("/profiles", userAuth, Profiles)

module.exports = app
