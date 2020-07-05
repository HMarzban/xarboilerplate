const app = require("express")()
const PlayLists = require("./playlists.router")
const { userAuth } = require("../../middleware/middleware")

app.use("/playlists", userAuth, PlayLists)

module.exports = app
