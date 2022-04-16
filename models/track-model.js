const mongoose = require('mongoose')

// name is the title of the track
// filename is the hexcode key used in the database
const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    requeired: true
  }
})

module.exports = mongoose.model('Track', trackSchema)