const bodyParser = require('body-parser');
const User = require('../models/user-model')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const findAllUsers = (req, res) => {
    try {
      User.find()
        .then(users => res.json(users))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const findUserByUsername = (req, res) => {
    try {
      User.find({ 
        username: req.body.username,
        password: req.body.password
       }, (error, user) => {
        if(user.length > 0) {
          res.json({"validationMessage": "verified", "userId": user[0]._id})
        } else {
          res.json({"validationMessage": "Incorrect Username/Password"})
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const addUser = (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    try {
      user.save()
        .then(user => res.json(user))
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  app.get("/users", findAllUsers)
  app.put("/users", findUserByUsername)
  app.post("/users", addUser)
}
