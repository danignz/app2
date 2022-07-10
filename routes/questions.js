const router = require("express").Router();
const Question = require("../models/Question");
const { isLoggedIn, checkRoles } = require("../middlewares");
const fileUploader = require('../config/cloudinary.config');

// @desc    Displays List of all Questions
// @route   GET /questions
// @access  Restricted to Admin role
router.get("/", checkRoles("admin"), async (req, res, next) => {
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
router.get("/create", checkRoles("admin"), (req, res, next) => {
  const enumValuesCategory = Question.schema.path("category").enumValues;
  const enumValuesDifficulty = Question.schema.path("difficulty").enumValues;

  const enumValues = {
    category: enumValuesCategory,
    difficulty: enumValuesDifficulty,
  };

  res.render("questions/new-question", { enumValues });
});

// @desc    Sends data fields related to a question to DB to create a new question
// @route   POST /questions/create
// @access  Restricted to Admin role
router.post("/create", checkRoles("admin"), fileUploader.single('question_img'), async (req, res, next) => {
  const {
    question,
    correct_answer,
    incorrect_answers_0,
    incorrect_answers_1,
    category,
    difficulty,
    isVisible,
  } = req.body;

  const incorrect_answers = [incorrect_answers_0, incorrect_answers_1];

  //Needed values to pass to the view if an error occurs to reload select input correctly
  const enumValuesCategory = Question.schema.path("category").enumValues;
  const enumValuesDifficulty = Question.schema.path("difficulty").enumValues;

  // Check if admin introduced all values
  if (
    !question ||
    !correct_answer ||
    !incorrect_answers_0 ||
    !incorrect_answers_1 ||
    !category ||
    !difficulty || 
    !req.file
  ) {
    res.render("questions/new-question", {
      error:
        "All fields (except Visible) are mandatory. Please fill them before submitting.",
      enumValues: {
        category: enumValuesCategory,
        difficulty: enumValuesDifficulty,
      },
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
      question_img: req.file.path,
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
router.get("/:questionId", checkRoles("admin"), async (req, res, next) => {
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
router.post(
  "/:questionId/delete",
  checkRoles("admin"),
  async (req, res, next) => {
    const { questionId } = req.params;
    try {
      await Question.findByIdAndRemove(questionId);
      res.redirect("/questions");
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Displays form to edit all the possible data fields of a question
// @route   GET /questions/questionId/edit
// @access  Restricted to Admin role
router.get("/:questionId/edit", checkRoles("admin"), async (req, res, next) => {
  const { questionId } = req.params;

  const enumValuesCategory = Question.schema.path("category").enumValues;
  const enumValuesDifficulty = Question.schema.path("difficulty").enumValues;

  try {
    const question = await Question.findById(questionId);

    const arrayCurrentCategory = enumValuesCategory.map((category) => {
      if (category === question.category) {
        return { category: category, isCurrent: true };
      } else {
        return { category: category, isCurrent: false };
      }
    });

    const arrayCurrentDifficulty = enumValuesDifficulty.map((difficulty) => {
      if (difficulty === question.difficulty) {
        return { difficulty: difficulty, isCurrent: true };
      } else {
        return { difficulty: difficulty, isCurrent: false };
      }
    });

    res.render("questions/edit-question", {
      question,
      arrayCurrentCategory,
      arrayCurrentDifficulty,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Sends data fields related to a question to store the new data in the DB
// @route   POST /questions/questionId/edit
// @access  Restricted to Admin role
router.post(
  "/:questionId/edit",
  checkRoles("admin"),
  fileUploader.single('question_img'),
  async (req, res, next) => {
    const { questionId } = req.params;
    const {
      question,
      correct_answer,
      incorrect_answers_0,
      incorrect_answers_1,
      category,
      difficulty,
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
      !req.file
    ) {
      res.render("questions/edit-question", {
        error:
          "All fields (except Visible) are mandatory. Please fill them before submitting.",
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
          question_img: req.file.path,
          isVisible: Boolean(isVisible),
        },
        { new: true }
      );
      console.log("Just updated:", updatedQuestion);
      res.redirect(`/questions/${questionId}`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
