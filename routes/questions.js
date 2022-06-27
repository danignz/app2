const router = require("express").Router();
const Question = require("../models/Question");

// @desc    Displays List of all Questions
// @route   GET /questions
// @access  Restricted to Admin role
router.get("/", async (req, res, next) => {
  try {
    const questions = await Question.find({});
    res.render("questions/questions", { questions });
  } catch (error) {
    next(error);
  }
});

// @desc    Displays form to add new questions to DB
// @route   GET /questions/create
// @access  Restricted to Admin role
router.get("/create", (req, res, next) => {
  res.render("questions/new-question");
});

// @desc    Sends data fields related to a question to DB to create a new question
// @route   POST /questions/create
// @access  Restricted to Admin role
router.post("/create", async (req, res, next) => {
  const {
    question,
    correct_answer,
    incorrect_answers_0,
    incorrect_answers_1,
    category,
    difficulty,
    question_img,
    isVisible,
  } = req.body;

  const incorrect_answers = [incorrect_answers_0, incorrect_answers_1];

  // Check if admin introduced all values
  if (
    !question ||
    !correct_answer ||
    !incorrect_answers_0 ||
    !incorrect_answers_1 ||
    !category ||
    !difficulty ||
    !question_img
  ) {
    res.render("questions/new-question", {
      error:
        "All fields (except isVisible) are mandatory. Please fill them before submitting.",
    });
    return;
  }

  try {
    await Question.create({
      question,
      correct_answer,
      incorrect_answers,
      category,
      difficulty,
      question_img,
      isVisible: Boolean(isVisible),
    });
    res.redirect("/questions");
  } catch (error) {
    next(error);
    res.redirect("/questions/create");
  }
});

// @desc    Show all data fields related to a question indicated by the ID
// @route   GET /questions/questionId
// @access  Restricted to Admin role
router.get("/:questionId", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    res.render("questions/question-details", question);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete the question indicated by the ID from DB
// @route   POST /questions/questionId/delete
// @access  Restricted to Admin role
router.post("/:questionId/delete", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    await Question.findByIdAndRemove(questionId);
    res.redirect("/questions");
  } catch (error) {
    next(error);
  }
});

// @desc    Displays form to edit all the possible data fields of a question
// @route   GET /questions/questionId/edit
// @access  Restricted to Admin role
router.get("/:questionId/edit", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    res.render("questions/edit-question", question);
  } catch (error) {
    next(error);
  }
});

// @desc    Sends data fields related to a question to store the new data in the DB
// @route   POST /questions/questionId/edit
// @access  Restricted to Admin role
router.post("/:questionId/edit", async (req, res, next) => {
  const { questionId } = req.params;
  const {
    question,
    correct_answer,
    incorrect_answers_0,
    incorrect_answers_1,
    category,
    difficulty,
    question_img,
    isVisible,
  } = req.body;

  const incorrect_answers = [incorrect_answers_0, incorrect_answers_1];

  // Check if admin introduced all values
  if (
    !question ||
    !correct_answer ||
    !incorrect_answers_0 ||
    !incorrect_answers_1 ||
    !category ||
    !difficulty ||
    !question_img
  ) {
    res.render("questions/edit-question", {
      error:
        "All fields (except isVisible) are mandatory. Please fill them before submitting.",
    });
    return;
  }

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        question,
        correct_answer,
        incorrect_answers,
        category,
        difficulty,
        question_img,
        isVisible: Boolean(isVisible),
      },
      { new: true }
    );
    console.log("Just updated:", updatedQuestion);
    res.redirect(`/questions/${questionId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
