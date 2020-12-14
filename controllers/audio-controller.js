const bodyParser = require('body-parser');
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const methodOverride = require('method-override')

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

  app.post('/upload', upload.single('audioFile'), (req, res) => {
    res.json({
      name: req.file.originalname,
      filename: req.file.filename
    })
  })
}
