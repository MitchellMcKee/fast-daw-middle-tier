const bodyParser = require('body-parser');
const ProjectTrack = require('../models/project-track-model')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const findAllProjectTracks = (req, res) => {
    try {
      ProjectTrack.find()
        .then(tracks => res.json(tracks))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const addProjectTrack = (req, res) => {
    const newProjectTrack = new ProjectTrack({
      name: req.body.name,
      editors: req.body.editors,
      tracks: req.body.tracks
    })
    try {
      newProjectTrack.save()
        .then(project => res.json(project))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const findProjectTrackById = (req, res) => {
    try {
      ProjectTrack.find({_id: req.params.projectId}, (error, project) => {
        if(project.length > 0) {
          res.json(project[0])
        } else {
          res.json({error: true})
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const updateProjectTrackById = (req, res) => {
    try {
      const updatedProjectTrack = {
        trackOrder: req.body.trackOrder,
        trackName: req.body.trackName,
        selectedFilename: req.body.selectedFilename,
        offset: req.body.offset,
        volume: req.body.volume
      }
      ProjectTrack.findOneAndUpdate({_id: req.params.projectTrackId}, updatedProjectTrack, (error, project) => {
        if(error) {
          res.send('Error: ' + error)
        } else {
          res.send(project)
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  app.get("/projectTracks/:projectTrackId", findProjectTrackById)
  app.put("/projectTracks/:projectTrackId", updateProjectTrackById)
  app.get("/projectTracks", findAllProjectTracks)
  app.post("/projectTracks", addProjectTrack)
}
