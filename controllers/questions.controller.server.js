const questionService = require("../services/questions.service.server")

module.exports = (app) => {
  const findQuestionsForQuiz = (req, res) => {
      const quizId = req.params['quizId']
      const questions = questionService.findQuestionsForQuiz(quizId)
      res.json(questions)
  }
  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz)
}
