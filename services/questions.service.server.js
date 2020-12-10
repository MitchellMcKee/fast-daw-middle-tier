let questions = require('./questions.json')

findQuestionsForQuiz = (quizId) => questions.filter(question => question.quizId === quizId)

module.exports = {
  findQuestionsForQuiz: findQuestionsForQuiz 
}