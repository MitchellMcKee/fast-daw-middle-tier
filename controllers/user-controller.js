const userService = require("../services/users-service")
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
    const username = req.body.username
    const password = req.body.password
    const users = userService.findAllUsers()
    let message = {"validationMessage": "Incorrect Username/Password"}
    users.forEach(user => {
      if(user.username === username && user.password === password) {
        message.validationMessage = "verified"
      }
    });
    res.json(message)
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
