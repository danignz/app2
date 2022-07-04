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

  let current_question, gameId, game;

  //check if a the user have the Quiz IN PROGRESS
  try {
    game = await Game.findOne({
      $and: [{ user: userId }, { quiz: quizId }, { status: "IN PROGRESS" }],
    });

    if (game) {
      current_question = game.current_question;
      gameId = game._id;
    }
  } catch (error) {
    next(error);
  }

  //console.log(game);
  //console.log(current_question);

  //if there is not game in progress
  if (!game) {
    console.log("pacoo");
    current_question = 0;
    try {
      game = await Game.create({
        user: userId,
        quiz: quizId,
        status: "NOT INIT",
        current_question: current_question,
      });
      gameId = game._id;
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

    let possibleAnswers = [
      quiz.question[game.current_question].correct_answer,
      quiz.question[game.current_question].incorrect_answers[0],
      quiz.question[game.current_question].incorrect_answers[1],
    ];
    console.log(possibleAnswers);

    const shuffledIndexArray = [0, 1, 2].sort((a, b) => 0.5 - Math.random());
    console.log(shuffledIndexArray);

    possibleAnswers[shuffledIndexArray[0]] =
      quiz.question[game.current_question].correct_answer;
    possibleAnswers[shuffledIndexArray[1]] =
      quiz.question[game.current_question].incorrect_answers[0];
    possibleAnswers[shuffledIndexArray[2]] =
      quiz.question[game.current_question].incorrect_answers[1];

    console.log(possibleAnswers);

    current_question++;
    res.render("game/question-to-solve", {
      question,
      total_questions,
      current_question,
      possibleAnswers,
      quizId,
      gameId,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete the question indicated by the ID from DB
// @route   POST /questions/questionId/delete
// @access  Restricted to Admin role
router.post("/:questionId/:gameId/check", async (req, res, next) => {
  const { questionId } = req.params;
  const { gameId } = req.params;
  const { answer } = req.body;
  let game;
  try {
    game = await Game.findById(gameId).populate("quiz").lean();
  } catch (error) {
    next(error);
  }

  console.log("lololo");
  console.log(game);
  let { current_question } = game;
  const num_questions = game.quiz.num_questions;
  const quizid = game.quiz._id;

  console.log("current question", current_question);
  console.log(num_questions);

  if (current_question === 0) {
    try {
      const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        {
          status: "IN PROGRESS",
        },
        { new: true }
      );
      console.log("Just updated:", updatedGame);
    } catch (error) {
      next(error);
    }
  }

  //  console.log("current cuestion; ", current_question);
  console.log("User choose; ", answer);
  try {
    const { correct_answer } = await Question.findById(questionId);
    console.log("DB value; ", correct_answer);

    if (answer === correct_answer) {
      try {
        await Game.findByIdAndUpdate(gameId, {
          $push: { answers: [true] },
        });
      } catch (error) {
        next(error);
      }
    } else {
      try {
        await Game.findByIdAndUpdate(gameId, {
          $push: { answers: [false] },
        });
      } catch (error) {
        next(error);
      }
    }

    current_question++;
    try {
      const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        {
          current_question: current_question,
        },
        { new: true }
      );
      console.log("Just updated:", updatedGame);
    } catch (error) {
      next(error);
    }

    let updatedGame;
    if (num_questions <= current_question) {
      try {
        updatedGame = await Game.findByIdAndUpdate(
          gameId,
          {
            status: "DONE",
          },
          { new: true }
        );
      } catch (error) {
        next(error);
      }

      const answersArray = updatedGame.answers;
      const total_right_answers = answersArray.filter(
        (element) => element === true ).length;
      const total_wrong_answers = answersArray.length - total_right_answers;

      const answersArrObject = answersArray.map((question, index) => {
          return { answersArray: question, index: index+1 }
      });

      console.log(answersArrObject);

      try {
        const updatedGame = await Game.findByIdAndUpdate(
          gameId,
          {
            total_right_answers: total_right_answers,
            total_wrong_answers: total_wrong_answers,
          },
          { new: true }
        );
        console.log("Just updated:", updatedGame);
      } catch (error) {
        next(error);
      }

      res.render("game/results", {
        answersArrObject,
        total_right_answers,
        total_wrong_answers,
        num_questions,
      });
    } else {
      res.redirect(`/game/${quizid}`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
