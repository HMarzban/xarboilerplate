const Tasks = require('./tasks.model')
const { q2ma } = require('q2ma')

const getAll = (queryString, projectId) => {
  const filter = { projectId }
  return q2ma(Tasks, { filter, queryString })
}

const getOne = taskId => Tasks.findOne({ _id: taskId }).lean()

const create = (projectId, body) => {
  const task = {
    ...body,
    projectId
  }
  return Tasks.create(task)
}

const update = (taskId, body) => Tasks.findOneAndUpdate({ _id: taskId }, { $set: body }, { new: true }).lean()

const remove = taskId => Tasks.findByIdAndRemove({ _id: taskId }).lean()

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
}
