const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const playListSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId },
    title: String,
    tracks: Array
  },
  {
    timestamps: true
  }
)

// Custom Methods and Properties
playListSchema.statics.SHORT_FIELDS = { id: 1, title: 1, createdAt: 1 }

const PlayLists = mongoose.model('playLists', playListSchema)
module.exports = mongoose.models.PlayLists || PlayLists
