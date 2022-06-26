const router = require("express").Router();
const Question = require("../models/Question");

router.get("/", async (req, res, next) => {
  try {
    const questions = await Question.find({});
    res.render("questions/questions", { questions });
  } catch (error) {
    next(error);
  }
});

router.get("/create", (req, res, next) => {
  res.render("questions/new-question");
});

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

  // Check if user introduced all values
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

router.get("/:questionId", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    res.render("questions/question-details", question);
  } catch (error) {
    next(error);
  }
});

router.post("/:questionId/delete", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    await Question.findByIdAndRemove(questionId);
    res.redirect("/questions");
  } catch (error) {
    next(error);
  }
});

router.get("/:questionId/edit", async (req, res, next) => {
  const { questionId } = req.params;
  try {
    const question = await Question.findById(questionId);
    res.render("questions/edit-question", question);
  } catch (error) {
    next(error);
  }
});

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

  // Check if user introduced all values
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
