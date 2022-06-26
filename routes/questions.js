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
  if (!question || !correct_answer || !incorrect_answers_0 || !incorrect_answers_1 || !category || !difficulty || !question_img ) {
    res.render("questions/new-question", {
      error: "All fields (except isVisible) are mandatory. Please fill them before submitting.",
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

module.exports = router;
