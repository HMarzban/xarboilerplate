const Projects = require("./projects.model")
const { q2ma } = require("../../utils")

const getAll = (queryString, user) => {
	const filter = { userId: user._id }
	return q2ma({ filter, queryString, collectionName: Projects })
}

const create = async (user, body) => {
	const project = {
		...body,
		userId: user._id,
	}
	const result = await Projects.create(project)
	return result._doc
}

const update = (projectId, body) => Projects.findOneAndUpdate({ _id: projectId }, { $set: body }, { new: true }).lean()

const remove = projectId => Projects.findByIdAndRemove({ _id: projectId }).lean()

module.exports = {
	getAll,
	create,
	update,
	remove,
}
