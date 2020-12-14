const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  editors: {
    type: Array,
    requeired: true
  },
  tracks: {
    type: Array,
    requeired: true
  }
})

module.exports = mongoose.model('project', projectSchema)