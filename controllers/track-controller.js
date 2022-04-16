const bodyParser = require('body-parser');
const Track = require('../models/track-model')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const findAllTracks = (req, res) => {
    try {
      Track.find()
        .then(tracks => res.json(tracks))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const addTrack = (req, res) => {
    const newTrack = new Track({
      name: req.body.name,
      filename: req.body.filename
    })
    try {
      newTrack.save()
        .then(track => res.json(track))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const findTrackById = (req, res) => {
    try {
      Track.find({_id: req.params.trackId}, (error, track) => {
        if(track.length > 0) {
          res.json(track[0])
        } else {
          res.json({error: true})
        }
      })
    } catch (error) {
      
      res.send('Error: ' + error)
    }
  }

  const deleteTrackById = (req, res) => {
    try {
      Track.findOneAndDelete({filename: req.params.trackId}, (error, track) => {
        if(error) {
          res.send('Error: ' + error)
        } else {
          res.send(track)
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  app.get("/tracks/:trackId", findTrackById)
  app.delete("/tracks/:trackId", deleteTrackById)
  app.get("/tracks", findAllTracks)
  app.post("/tracks", addTrack)
}
