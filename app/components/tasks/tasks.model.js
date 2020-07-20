const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const STATE = ['done', 'pending', 'processing', 'later']

const tasksSchema = new mongoose.Schema(
  {
    title: { type: String },
    projectId: { type: ObjectId, indexes: true },
    userAssignment: {
      name: String,
      _id: ObjectId
    },
    slug: { type: String },
    content: { type: String },
    state: { type: String, enum: STATE, default: 'pending' }
  },
  {
    timestamps: true
  }
)

const Tasks = mongoose.model('tasks', tasksSchema)
module.exports = mongoose.models.Tasks || Tasks
