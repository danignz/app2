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
  const enumValuesImages = Quiz.schema.path("quiz_img").enumImages;

  const enumValues = {
    category: enumValuesCategory,
    difficulty: enumValuesDifficulty,
    quiz_img: enumValuesImages
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
  const enumValuesImages = Quiz.schema.path("quiz_img").enumImages;

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
        "All fields (except Visible) are mandatory. Please fill them before submitting.",
      enumValues: {
        category: enumValuesCategory,
        difficulty: enumValuesDifficulty,
        quiz_img: enumValuesImages
      },
    });
    return;
  }

  try {
    // Check if title exists on our DB
    const quiz = await Quiz.findOne({ title: title });
    // If its repeated, send them error message
    if (quiz) {
      res.render("quizzes/new-quiz", {
        error: "Title its busy, try a new one.",
        enumValues: {
          category: enumValuesCategory,
          difficulty: enumValuesDifficulty,
          quiz_img: enumValuesImages,
        },
      });
      return;
    }
  } catch (error) {
    next(error);
  }

  let questions;
  try {
    questions = await Question.find(
      {
        $and: [{ category: category }, { difficulty: difficulty }, { images: quiz_img }],
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
    const quiz = await Quiz.findById(quizId).populate("question").lean();

    const indexOfQuestions = quiz.question.map((question, index) => {
        return index+1;
    });

    quiz.question.forEach((question,index) => {
      quiz.question[index].indexOfQuestions = indexOfQuestions[index];
    });

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

// @desc    Displays form to edit all the possible data fields of a quiz
// @route   GET /quizzes/quizId/edit
// @access  Restricted to Admin role
router.get("/:quizId/edit", async (req, res, next) => {
  const { quizId } = req.params;

  const enumValuesCategory = Quiz.schema.path("category").enumValues;
  const enumValuesDifficulty = Quiz.schema.path("difficulty").enumValues;
  const enumValuesImages = Quiz.schema.path("quiz_img").enumImages;

  try {
    const quiz = await Quiz.findById(quizId).populate("question");

    const arrayCurrentCategory = enumValuesCategory.map((category) => {
      if (category === quiz.category) {
        return { category: category, isCurrent: true };
      } else {
        return { category: category, isCurrent: false };
      }
    });

    const arrayCurrentDifficulty = enumValuesDifficulty.map((difficulty) => {
      if (difficulty === quiz.difficulty) {
        return { difficulty: difficulty, isCurrent: true };
      } else {
        return { difficulty: difficulty, isCurrent: false };
      }
    });

    const arrayCurrentImages = enumValuesImages.map((quiz_img) => {
      if (images === quiz.quiz_img) {
        return { images: quiz_img, isCurrent: true };
      } else {
        return { images: quiz_img, isCurrent: false };
      }
    });

    res.render("quizzes/edit-quiz", {
      quiz,
      arrayCurrentCategory,
      arrayCurrentDifficulty,
      arrayCurrentImages,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Sends data fields related to a quiz to store the new data in the DB
// @route   POST /quizzes/quizId/edit
// @access  Restricted to Admin role
router.post("/:quizId/edit", async (req, res, next) => {
  const { quizId } = req.params;
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
  const enumValuesImages = Quiz.schema.path("quiz_img").enumImages;

  let quiz, arrayCurrentCategory, arrayCurrentDifficulty, arrayCurrentImages ;

  try {
    quiz = await Quiz.findById(quizId).populate("question");

    arrayCurrentCategory = enumValuesCategory.map((category) => {
      if (category === quiz.category) {
        return { category: category, isCurrent: true };
      } else {
        return { category: category, isCurrent: false };
      }
    });

    arrayCurrentDifficulty = enumValuesDifficulty.map((difficulty) => {
      if (difficulty === quiz.difficulty) {
        return { difficulty: difficulty, isCurrent: true };
      } else {
        return { difficulty: difficulty, isCurrent: false };
      }
      
    });

    const arrayCurrentImages = enumValuesImages.map((quiz_img) => {
      if (images === quiz.quiz_img) {
        return { images: quiz_img, isCurrent: true };
      } else {
        return { images: quiz_img, isCurrent: false };
      }
    });

  } catch (error) {
    next(error);
  }

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
    res.render("quizzes/edit-quiz", {
      error:
        "All fields (except Visible) are mandatory. Please fill them before submitting.",
      arrayCurrentCategory: arrayCurrentCategory,
      arrayCurrentDifficulty: arrayCurrentDifficulty,
      arrayCurrentImages: arrayCurrentImages,
      quiz: quiz,
    });
    return;
  }

  if(quiz.title !== title){
    try {
      // Check if new title exists on our DB
      const quizByTitle = await Quiz.findOne({ title: title });
      // If its repeated, send them error message
      if (quizByTitle) {
        res.render("quizzes/edit-quiz", {
          error: "Title its busy, try a new one.",
          arrayCurrentCategory: arrayCurrentCategory,
          arrayCurrentDifficulty: arrayCurrentDifficulty,
          quiz: quiz,
        });
        return;
      }
    } catch (error) {
      next(error);
    }
  }

  let questions;

  if (parseInt(num_questions) !== quiz.num_questions) {
    try {
      questions = await Question.find(
        {
          $and: [{ category: category }, { difficulty: difficulty },  { images: quiz_img }],
        },
        { _id: 1 }
      ).limit(num_questions);
    } catch (error) {
      next(error);
    }
  } else {
    questions = quiz.question;
  }

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        title,
        description,
        category,
        difficulty,
        points_required: parseInt(points_required),
        num_questions: parseInt(num_questions),
        quiz_img,
        isVisible: Boolean(isVisible),
        question: questions,
      },
      { new: true }
    );
    console.log("Just updated:", updatedQuiz);
    res.redirect(`/quizzes/${quizId}`);
  } catch (error) {
    next(error);
    res.redirect(`/quizzes/${quizId}`);
  }
});

module.exports = router;
