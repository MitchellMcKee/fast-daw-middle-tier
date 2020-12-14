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

  const checkUserCredentials = (req, res) => {
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

  const findUserById = (req, res) => {
    try {
      User.find({_id: req.params.userId}, (error, user) => {
        if(user.length > 0) {
          res.json(user[0])
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  const updateUserById = (req, res) => {
    try {
      User.findOneAndUpdate({_id: req.params.userId}, {username: req.body.username, password: req.body.password}, (error, user) => {
        if(error) {
          res.send('Error: ' + error)
        } else {
          res.send(user)
        }
      })
    } catch (error) {
      res.send('Error: ' + error)
    }
  }

  app.get("/users/:userId", findUserById)
  app.put("/users/:userId", updateUserById)
  app.get("/users", findAllUsers)
  app.put("/users", checkUserCredentials)
  app.post("/users", addUser)
}
