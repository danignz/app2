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
    const { question, correct_answer, incorrect_answers, category, difficulty, question_img, isVisible } = req.body;
    try { 
       await Question.create({ question, correct_answer, incorrect_answers, category, difficulty, question_img, isVisible });
       res.redirect("/questions");
    }  catch (error) {
       next(error);
       res.redirect("/questions/create"); 
    } 
});

module.exports = router;