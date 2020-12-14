const mongoose = require('mongoose')

const projectTrackSchema = new mongoose.Schema({
  trackOrder: {
    type: String,
    required: false
  },
  trackName: {
    type: String,
    required: false
  },
  selectedFilename: {
    type: String,
    required: false
  },
  offset: {
    type: Number,
    required: false
  },
  volume: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('ProjectTrack', projectTrackSchema)