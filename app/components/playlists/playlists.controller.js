const PlayLists = require('./playlists.model')
const { q2ma } = require('q2ma')

const getAll = (queryString, user) => {
  const filter = { userId: user._id }
  const project = PlayLists.SHORT_FIELDS
  return q2ma(PlayLists, { filter, queryString, project })
}

const getOne = (playListId, user) => {
  const filter = { _id: playListId, userId: user._id }
  return PlayLists.findOne(filter).lean()
}

const create = (user, body) => {
  const task = {
    tracks: [body.track],
    title: body.title,
    userId: user._id
  }
  return PlayLists.create(task)
}

const update = (playListId, body) => PlayLists.findOneAndUpdate({ _id: playListId }, { $push: { tracks: body.track } }, { new: true }).lean()

const remove = playListId => PlayLists.findByIdAndRemove({ _id: playListId }).lean()

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
}
