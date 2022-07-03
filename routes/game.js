const router = require("express").Router();
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const Game = require("../models/Game");

// @desc    Show all quizzes that are able to be played for the user
// @route   GET /game/select
// @access  User role
router.get("/select", async (req, res, next) => {
  const user = req.session.currentUser;
  let quizzes;
  try {
    quizzes = await Quiz.find({});
  } catch (error) {
    next(error);
  }
  res.render("game/select", { user, quizzes });
});

// @desc    Get ready for starting to play a game
// @route   GET /game/quizId
// @access  User role
router.get("/:quizId", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const { quizId } = req.params;

  console.log(userId);
  console.log(quizId);

  //check if a the user have the Quiz IN PROGRESS
  let gameInProgress;
  let current_question;
  try {
    gameInProgress = await Game.find(
      {
        $and: [{ user: userId }, { quiz: quizId }, { status: "IN PROGRESS" }],
      },
      { _id: 1 }
    );

    if(gameInProgress.length){
      current_question = gameInProgress.current_question;
    }
  } catch (error) {
    next(error);
  }

  console.log(gameInProgress);
  let game;
  //if there is not game in progress
    if(!gameInProgress.length){
console.log("pacoo");
    current_question = 0;
    try {
      game= await Game.create({
        user: userId,
        quiz: quizId,
        status: "NOT INIT",
        current_question: current_question,
      });
    } catch (error) {
      next(error);
    }

  }

//  console.log(game.current_question);

  let total_questions;
  try {
    const quiz = await Quiz.findById(quizId).populate("question").lean();
    total_questions = quiz.num_questions;
    const question = quiz.question[game.current_question];
    console.log(question);

    let possibleAnswers = [quiz.question[game.current_question].correct_answer, quiz.question[game.current_question].incorrect_answers[0], quiz.question[game.current_question].incorrect_answers[1]];
    console.log(possibleAnswers);

    const shuffledIndexArray = [0, 1, 2].sort((a, b) => 0.5 - Math.random());
    console.log(shuffledIndexArray);

    possibleAnswers[shuffledIndexArray[0]] = quiz.question[game.current_question].correct_answer;
    possibleAnswers[shuffledIndexArray[1]] = quiz.question[game.current_question].incorrect_answers[0];
    possibleAnswers[shuffledIndexArray[2]] = quiz.question[game.current_question].incorrect_answers[1];
    
    console.log(possibleAnswers);
    /*
      const indexOfQuestions = quiz.question.map((question, index) => {
          return index+1;
      });
  
      quiz.question.forEach((question,index) => {
        quiz.question[index].indexOfQuestions = indexOfQuestions[index];
      });
    */
    
    //Need to increase because index array starts from 0

    current_question++;
    res.render("game/question-to-solve", {question, total_questions, current_question, possibleAnswers, quizId});
  } catch (error) {
    next(error);
  }
});

// @desc    Delete the question indicated by the ID from DB
// @route   POST /questions/questionId/delete
// @access  Restricted to Admin role
router.post("/:questionId/:quizid/:current_question/check", async (req, res, next) => {
  const { questionId } = req.params;
  const { quizid } =  req.params;
  const { current_question } =  req.params;
  const { answer } = req.body;
  console.log("quiz id; ", quizid);
  console.log("current cuestion; ", current_question);
  console.log("User choose; ", answer);
  try {
    const {correct_answer} = await Question.findById(questionId);
    console.log("DB value; ",correct_answer);

    if(answer === correct_answer){
      console.log("Right Answer, well done!!!!!!!!!!");
    }else{
      console.log("You fail!!!!!!!!"); 
    }

    res.redirect(`/game/${quizid}`);

  } catch (error) {
    next(error);
  }

  try {

  } catch (error) {
    next(error);
  }


});

module.exports = router;
