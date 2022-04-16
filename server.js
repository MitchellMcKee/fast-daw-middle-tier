const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const app = express()

app.use(cors());
app.options('*', cors());

// set up of gridfs
const conn = mongoose.createConnection('mongodb://localhost/fast-daw', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connect('mongodb://localhost/fast-daw', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

let gfs

conn.once('open', () => {
  console.log("connection created")
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
}).on('error', error => {
  console.log('error is: ' + error)
})

require('./controllers/audio-controller')(app)
require('./controllers/track-controller')(app)

app.get('/files', (req, res) => {
  gfs.files.find().toArray((error, files) => {
    if(!files || files.length === 0) {
      return res.status(404).json({
        error: 'No files exist'
      })
    }
    return res.json(files)
  })
})

app.get('/files/:audioId', (req, res) => {
  gfs.files.findOne({ filename: req.params.audioId }, (error, file) => {
    if(!file || file.length === 0) {
      return res.status(404).json({
        error: 'No files exist'
      })
    }
    if (file.contentType === 'audio/mpeg') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        error: "Not an audio file"
      })
    }
  })
})

app.listen(3200)