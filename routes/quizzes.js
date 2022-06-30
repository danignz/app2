const router = require("express").Router();
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// @desc    Displays List of all Quizzes
// @route   GET /quizzes
// @access  Restricted to Admin role
router.get("/", async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({}).populate("question");
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

  res.render("quizzes/new-quiz", { enumValues });
});

// @desc    Sends data fields related to a quiz to DB to create a new quiz
// @route   POST /quizzes/create
// @access  Restricted to Admin role
router.post("/create", async (req, res, next) => {
  const {
    title,
    description,
    category,
    difficulty,
    points_required,
    num_questions,
    quiz_img,
    isVisible,
  } = req.body;

  //Needed values to pass to the view if an error occurs to reload select input correctly
  const enumValuesCategory = Quiz.schema.path("category").enumValues;
  const enumValuesDifficulty = Quiz.schema.path("difficulty").enumValues;

  // Check if admin introduced all values
  if (
    !title ||
    !description ||
    !category ||
    !difficulty ||
    !points_required ||
    !num_questions ||
    !quiz_img
  ) {
    res.render("quizzes/new-quiz", {
      error:
        "All fields (except isVisible) are mandatory. Please fill them before submitting.",
      enumValues: {
        category: enumValuesCategory,
        difficulty: enumValuesDifficulty,
      },
    });
    return;
  }

  let questions;
  try {
    questions = await Question.find(
      {
        $and: [{ category: category }, { difficulty: difficulty }],
      },
      { _id: 1 }
    ).limit(num_questions);
  } catch (error) {
    next(error);
  }

  try {
    await Quiz.create({
      title,
      description,
      category,
      difficulty,
      points_required: parseInt(points_required),
      num_questions: parseInt(num_questions),
      quiz_img,
      isVisible: Boolean(isVisible),
      question: questions,
    });
    res.redirect("/quizzes");
  } catch (error) {
    next(error);
    res.redirect("/quizzes/create");
  }
});

// @desc    Show all data fields related to a quiz indicated by the ID
// @route   GET /quizzes/quizId
// @access  Restricted to Admin role
router.get("/:quizId", async (req, res, next) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId).populate("question");
    res.render("quizzes/quiz-details", quiz);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete the quiz indicated by the ID from DB
// @route   POST /quizzes/quizId/delete
// @access  Restricted to Admin role
router.post("/:quizId/delete", async (req, res, next) => {
  const { quizId } = req.params;
  try {
    await Quiz.findByIdAndRemove(quizId);
    res.redirect("/quizzes");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
