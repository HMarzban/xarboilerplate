const router = require("../../utils").router()
const Tasks = require("./tasks.controller")
const valid = require("./tasks.validator")

router.get("/healthCheck", "Ok")

router.get("/project/:projectId", (req, res) => {
	const queryString = req.queryString
	const { projectId } = req.params
	return Tasks.getAll(queryString, projectId)
})

router.get("/:taskId", valid.getOne, (req, res) => {
	const { taskId } = req.params
	return Tasks.getOne(taskId)
})

router.post("/project/:projectId", valid.createTask, (req, res) => {
	const body = req.body
	const { projectId } = req.params
	return Tasks.create(projectId, body)
})

router.put("/:taskId", valid.updateTask, (req, res) => {
	const { taskId } = req.params
	const body = req.body
	return Tasks.update(taskId, body)
})

router.delete("/:taskId", valid.removeTask, (req, res) => {
	const { taskId } = req.params
	return Tasks.remove(taskId)
})

module.exports = router.expressRouter
