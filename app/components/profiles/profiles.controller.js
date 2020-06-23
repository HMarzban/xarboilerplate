const Profiles = require("./profiles.model")

const getProfile = async (user, Projects, Tasks) => {
	const [projects, tasks, profile] = await Promise.all([
		Projects.find({ userId: user._id }).limit(10).lean(),
		Tasks.find({ "userAssignment._id": user._id }).sort({ createdAt: -1 }).limit(10).lean(),
		Profiles.findOne({ _id: user._id }, { password: 0 }).lean(),
	])

	return { profile, tasks, projects }
}

const update = async (user, body) => Profiles.findOneAndUpdate({ _id: user._id }, { $set: body }, { new: true }).lean()

const remove = user => Profiles.findByIdAndRemove({ _id: user._id }).lean()

module.exports = {
	getProfile,
	update,
	remove,
}
