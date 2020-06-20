const Itunes = require("../../services/itunes")

const albums = artistName => Itunes.search(artistName)

module.exports = {
	albums,
}
