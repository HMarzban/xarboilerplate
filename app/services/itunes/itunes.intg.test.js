const { search } = require("./index")

describe("Service: Search ituns for Artists", () => {
	it("Search for 'Lady Gaga' Albumes and its tracks ", async () => {
		const artistName = "Lady Gaga"
		const results = await search(artistName)
		expect(results).toHaveLength(1)
		expect(results[0].artistName).toBe(artistName)
		expect(results[0].topAlbums.length).toBeGreaterThanOrEqual(3)
	})

	it("Search for 'selena' Albumes and its tracks ", async () => {
		const artistName = "selena"
		const results = await search(artistName)
		const artistNames = results.map(artist => artist.artistName)
		const expectArtistsNames = ["Selena", "Selena Gomez", "Aubrey Selena", "Selena Seballo", "Selena Lee"]
		expect(results.length).toBeGreaterThanOrEqual(13)
		expect(artistNames).toEqual(expect.arrayContaining(expectArtistsNames))
	})
})
