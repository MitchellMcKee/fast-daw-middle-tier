const userService = require("../services/users-service")
const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const findAllUsers = (req, res) => {
      const users = userService.findAllUsers()
      res.json(users)
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

  app.get("/users", findAllUsers)
  app.put("/users/:username", findUserByUsername)
}
