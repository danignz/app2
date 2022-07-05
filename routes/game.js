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

// @desc    Send to the view all the data needed to render a question
// @route   GET /game/quizId
// @access  User role
router.get("/:quizId", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const { quizId } = req.params;

  let current_question, gameId, game;

  //check if the user have the same Quiz IN PROGRESS
  try {
    game = await Game.findOne({
      $and: [{ user: userId }, { quiz: quizId }, { status: "IN PROGRESS" }],
    });
    //restore the game point of last game
    if (game) {
      current_question = game.current_question;
      gameId = game._id;
    }
  } catch (error) {
    next(error);
  }

  //if there is not a game IN PROGRESS for that Quiz
  if (!game) {
    current_question = 0;
    //creates a new Game
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

  let total_questions;
  try {
    const quiz = await Quiz.findById(quizId).populate("question").lean();

    if (quiz.question.length === 0) {
      res.render("game/error", {
        error: "This Quiz have not questions. Please try another one",
      });
      return;
    }

    total_questions = quiz.num_questions;
    const question = quiz.question[game.current_question];

    //Obtain all possible answers for that question
    let possibleAnswers = [
      quiz.question[game.current_question].correct_answer,
      quiz.question[game.current_question].incorrect_answers[0],
      quiz.question[game.current_question].incorrect_answers[1],
    ];

    //Generate a random unordered values for use as index of a array
    const shuffledIndexArray = [0, 1, 2].sort((a, b) => 0.5 - Math.random());

    //Shuffle the possible answers getting a different order to answer in every Game
    possibleAnswers[shuffledIndexArray[0]] =
      quiz.question[game.current_question].correct_answer;
    possibleAnswers[shuffledIndexArray[1]] =
      quiz.question[game.current_question].incorrect_answers[0];
    possibleAnswers[shuffledIndexArray[2]] =
      quiz.question[game.current_question].incorrect_answers[1];

    //increase the current question to present to the player as Question 1 instead of Question 0
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

// @desc    Manage the response received from de player
// @route   POST /game/questionId/gameId/check
// @access  User role
router.post("/:questionId/:gameId/check", async (req, res, next) => {
  const { questionId } = req.params;
  const { gameId } = req.params;
  const { answer } = req.body;
  let game;

  //Obtain all the data from DB relative to the current Game and Quiz
  try {
    game = await Game.findById(gameId).populate("quiz").lean();
  } catch (error) {
    next(error);
  }

  let { current_question } = game;
  const num_questions = game.quiz.num_questions;
  const quizid = game.quiz._id;

  //if it's the first question of the Quiz, change the status to IN PROGRESS
  if (current_question === 0) {
    try {
      await Game.findByIdAndUpdate(gameId, {
        status: "IN PROGRESS",
      });
    } catch (error) {
      next(error);
    }
  }

  try {
    const { correct_answer } = await Question.findById(questionId);
    //Compare the answer value from DB vs the player input ones
    if (answer === correct_answer) {
      //if its right, save it on DB as true
      try {
        await Game.findByIdAndUpdate(gameId, {
          $push: { answers: [true] },
        });
      } catch (error) {
        next(error);
      }
    } else {
      //if its incorrect, save it on DB as false
      try {
        await Game.findByIdAndUpdate(gameId, {
          $push: { answers: [false] },
        });
      } catch (error) {
        next(error);
      }
    }

    //increase on the DB the current question variable, to get ready for a new question
    current_question++;
    try {
      await Game.findByIdAndUpdate(gameId, {
        current_question: current_question,
      });
    } catch (error) {
      next(error);
    }

    //if it's the last question then manage the end of the game
    let updatedGame;
    if (num_questions <= current_question) {
      //mark as DONE in DB
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

      //get in an array all the answers that the player sended
      const answersArray = updatedGame.answers;
      //get the number of right answers
      const total_right_answers = answersArray.filter(
        (element) => element === true
      ).length;
      //get the number of incorrect answers
      const total_wrong_answers = answersArray.length - total_right_answers;

      //Generate a new object with the answers and the right index to pass it to handlebars view
      const answersArrObject = answersArray.map((question, index) => {
        return { answersArray: question, index: index + 1 };
      });

      //Update DB with the total right/wrong answers number
      try {
        await Game.findByIdAndUpdate(gameId, {
          total_right_answers: total_right_answers,
          total_wrong_answers: total_wrong_answers,
        });
      } catch (error) {
        next(error);
      }

      //Render the results view
      res.render("game/results", {
        answersArrObject,
        total_right_answers,
        total_wrong_answers,
        num_questions,
      });
      //if its not the end of the game, redirect to the GET /game/quizid route to continue playing
    } else {
      res.redirect(`/game/${quizid}`);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
