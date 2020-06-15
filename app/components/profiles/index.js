const app = require("express")()
const Profiles = require("./profiles.router")
const { userAuth } = require("../../middleware/auth.middelware")

app.use("/profiles", userAuth, Profiles)

module.exports = app
