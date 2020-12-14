const bodyParser = require('body-parser');
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const methodOverride = require('method-override')
const Track = require('../models/Track-model')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride('_method'))

  const storage = new GridFsStorage({
    url: 'mongodb://localhost/fast-daw',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (error, buffer) => {
          if (error) {
            return reject(error)
          }
          const filename = buffer.toString('hex') + path.extname(file.originalname)
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          }
          resolve(fileInfo)
        })
      })
    }
  })
  const upload = multer({ storage })

  // helper functions
  const addTrack = (name, filename) => {
    const track = new Track({
      name: name,
      filename: filename
    })
    try {
      track.save()
    } catch (error) {
      res.send('Error, Track not saved: ' + error)
    }
  }

  // routes
  app.post('/upload', upload.single('audioFile'), (req, res) => {
    res.json({ file: req.file })
    addTrack(req.file.originalname, req.file.filename)
  })

  app.get('/tracks', (req, res) => {
    try {
      Track.find()
        .then(tracks => res.json(tracks))
    } catch (error) {
      res.send('Error, could not fetch tracks: ' + error)
    }
  })
}
