const express = require('express')
const mongoose = require('mongoose')
const mongodb = require('mongodb')

const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Content-Type, X-Requested-With, Origin');
  res.header('Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

mongoose.connect('mongodb://localhost/fast-daw', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
  console.log('connection has been made')})
    .on('error', error => {
      console.log('error is:', error)
    })

require('./controllers/user-controller')(app)

app.get('/hello', (req, res) => res.send("yes chef"))

app.listen(3200)