const bodyParser = require('body-parser');
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')

module.exports = (app) => {
  const conn = mongoose.createConnection('mongodb://localhost/fast-daw', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  
  let gfs
  
  conn.once('open', () => {
    console.log("connection created")
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
  }).on('error', error => {
    console.log('error is: ' + error)
  })

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

  app.post('/upload', upload.single('audioFile'), (req, res) => {
    res.json({ file: req.file })
  })

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
}
