const mongoose = require("mongoose")
const Profiles = require("./profiles.controller")
const valid = require("./profiles.validator")
const router = require("../../utils").router()

const Projects = mongoose.models.projects
const Tasks = mongoose.models.tasks

router.get("/healthCheck", "Ok")

router.get("/", (req, res) => {
	const user = req.local.user
	return Profiles.getProfile(user, Projects, Tasks)
})

router.put("/", valid.updateProfile, (req, res) => {
	const user = req.local.user
	const body = req.body
	return Profiles.update(user, body)
})

router.delete("/", (req, res) => {
	const user = req.local.user
	return Profiles.remove(user)
})

module.exports = router.expressRouter
