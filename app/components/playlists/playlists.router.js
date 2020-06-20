const router = require("../../utils").router()
const PlayLists = require("./playlists.controller")
const valid = require("./playlists.validator")

router.get("/healthCheck", "Ok")

router.get("/", (req, res) => {
	const queryString = req.queryString
	const user = req.local.user
	return PlayLists.getAll(queryString, user)
})

router.get("/:playListId", (req, res) => {
	const { playListId } = req.params
	const user = req.local.user
	return PlayLists.getOne(playListId, user)
})

router.post("/", valid.createPlayList, (req, res) => {
	const body = req.body
	const user = req.local.user
	return PlayLists.create(user, body)
})

router.put("/:playListId", valid.updatePlayList, (req, res) => {
	const { playListId } = req.params
	const body = req.body
	return PlayLists.update(playListId, body)
})

router.delete("/:playListId", valid.removePlayList, (req, res) => {
	const { playListId } = req.params
	return PlayLists.remove(playListId)
})

module.exports = router.expressRouter
