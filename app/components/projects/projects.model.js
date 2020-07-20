const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, indexes: true },
    description: { type: String },
    slug: { type: String },
    userId: { type: ObjectId }
  },
  {
    timestamps: true
  }
)

const Projects = mongoose.model('projects', projectSchema)
module.exports = mongoose.models.Projects || Projects
