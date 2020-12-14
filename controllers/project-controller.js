const bodyParser = require('body-parser');
const Project = require('../models/project-model')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const findAllProjects = (req, res) => {
    try {
      Project.find()
        .then(projects => res.json(projects))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const addProject = (req, res) => {
    const newProject = new Project({
      name: req.body.name,
      editors: req.body.editors,
      tracks: req.body.tracks
    })
    try {
      newProject.save()
        .then(project => res.json(project))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const findProjectById = (req, res) => {
    try {
      Project.find({_id: req.params.projectId}, (error, project) => {
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

  const updateProjectById = (req, res) => {
    try {
      Project.findOneAndUpdate(
        {_id: req.params.projectId}, 
        {
          name: req.body.name,
          editors: req.body.editors,
          tracks: req.body.tracks
        }, 
        (error, project) => {
        if(error) {
          res.json({error: true})
        } else {
          res.send(project)
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  app.get("/projects/:projectId", findProjectById)
  app.put("/projects/:projectId", updateProjectById)
  app.get("/projects", findAllProjects)
  app.post("/projects", addProject)
}
