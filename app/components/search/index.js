const app = require("express")()
const Search = require("./search.router")

app.use("/search/itunes", Search)

module.exports = app
