const mongoose = require('mongoose')

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