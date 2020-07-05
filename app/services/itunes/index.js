const superagent = require("superagent")

const ITUNES_URL = "https://itunes.apple.com"

const searchArtists = async artistName => {
	const URL = `${ITUNES_URL}/search?term=${artistName}&entity=musicArtist`
	let artists = await superagent.get(URL)
	if (artists.status !== 200) throw new Error({ code: "EXCEPTION", detail: { status: artists.status, body: artists.body }, Message: "searching for artist has issues!" })

	artists = JSON.parse(artists.text)
	const artistsId = artists.results.map(el => el.artistId).join(",")
	return { artists: artists.results, artistsId }
}

const searchAlbums = async artistsId => {
	const URL = `${ITUNES_URL}/lookup?id=${artistsId}&entity=album&limit=3&sort=top`
	let result = await superagent.get(URL)
	if (result.status !== 200) throw new Error({ code: "EXCEPTION", detail: { status: result.status, body: result.body }, Message: "searching for albums has issues!" })

	result = JSON.parse(result.text)
	result = result.results.filter(album => album.collectionType === "Album")

	const albumsId = result
		.map(el => el.collectionId & el.collectionId)
		.filter(Number)
		.join(",")

	return { albums: result, albumsId }
}

const searchSongs = async albumsId => {
	const URL = `${ITUNES_URL}/lookup?id=${albumsId}&entity=song`
	let result = await superagent.get(URL)
	if (result.status !== 200) throw new Error({ code: "EXCEPTION", detail: { status: result.status, body: result.body }, Message: "searching for songs has issues!" })

	result = JSON.parse(result.text)
	result = result.results
	var albumList = {}
	result.forEach(x => {
		if (x.wrapperType === "collection") albumList[x.collectionId] = []
		else albumList[x.collectionId].push(x)
	})

	return albumList
}

const search = async artistName => {
	if (!artistName) return []

	const { artists, artistsId } = await searchArtists(artistName)

	const { albums, albumsId } = await searchAlbums(artistsId)

	const albumSongs = await searchSongs(albumsId)

	// bind album songs
	albums.forEach((val, index) => {
		if (albumSongs[val.collectionId] && albumSongs[val.collectionId].length) albums[index].tracks = albumSongs[val.collectionId]
	})

	// bind album to artists
	artists.forEach((artist, index) => {
		const artistAlbums = albums.filter(album => album.artistId === artist.artistId)
		if (artistAlbums) artists[index].topAlbums = artistAlbums
	})

	return artists
}

module.exports = Object.freeze({
	searchArtists,
	searchAlbums,
	searchSongs,
	search,
})
