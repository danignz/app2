const router = require("express").Router();
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// @desc    Displays List of all Quizzes
// @route   GET /quizzes
// @access  Restricted to Admin role
router.get("/", async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({});
    res.render("quizzes/quizzes", { quizzes });
  } catch (error) {
    next(error);
  }
});

// @desc    Displays form to add new quizzes to DB
// @route   GET /quizzes/create
// @access  Restricted to Admin role
router.get("/create", (req, res, next) => {
  const enumValuesCategory = Quiz.schema.path("category").enumValues;
  const enumValuesDifficulty = Quiz.schema.path("difficulty").enumValues;

  const enumValues = {
    category: enumValuesCategory,
    difficulty: enumValuesDifficulty,
  };

  res.render("quizzes/new-quiz", enumValues);
});

// @desc    Sends data fields related to a quiz to DB to create a new quiz
// @route   POST /quizzes/create
// @access  Restricted to Admin role
router.post("/create", async (req, res, next) => {
  const {
    title,
    description,
    difficulty,
    category,
    points_required,
    question,
    num_questions,
    quiz_img,
    isVisible,
  } = req.body;

  const incorrect_answers = [incorrect_answers_0, incorrect_answers_1];

  // Check if admin introduced all values
  if (
    !quiz ||
    !correct_answer ||
    !incorrect_answers_0 ||
    !incorrect_answers_1 ||
    !category ||
    !difficulty ||
    !question_img
  ) {
    res.render("quizzes/new-quiz", {
      error:
        "All fields (except isVisible) are mandatory. Please fill them before submitting.",
    });
    return;
  }

  try {
    await Quiz.create({
      quiz,
      correct_answer,
      incorrect_answers,
      category,
      difficulty,
      question_img,
      isVisible: Boolean(isVisible),
    });
    res.redirect("/quizzes");
  } catch (error) {
    next(error);
    res.redirect("/quizzes/create");
  }
});

module.exports = router;
