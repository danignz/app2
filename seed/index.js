require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const questions = [
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "[1, 2, 3, 4]",
    incorrect_answers: ["[4, 2, 1, 3]", "[4, 3, 2, 1]"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-1.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "undefined",
    incorrect_answers: ["3", "7"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-2.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "string",
    incorrect_answers: ["number", "true"],
    category: "JAVASCRIPT",
    difficulty: "ADVANCED",
    question_img: "/images/questions/JS-3.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "number",
    incorrect_answers: ["boolean", "string"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-4.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "262",
    incorrect_answers: ["NaN", "10"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-5.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "false",
    incorrect_answers: ["null", "true"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-6.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "21",
    incorrect_answers: ["22", "20"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-7.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "4.50",
    incorrect_answers: ["4", "4.5"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-8.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "['I','like','tea']",
    incorrect_answers: ["'I like tea'", "['Iliketea']"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-9.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "dog",
    incorrect_answers: ["koala", "tiger"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-10.jpg",
    isVisible: true,
  },
];

mongoose
  .connect(process.env.MONGO_URL)
  .then((x) => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Question.insertMany(questions);
  })
  .then((arrayQuestions) => {
    const arrayQuestionsID = arrayQuestions.map((question) => {
      return question.id;
    });

    const quizzes = [
      {
        title: "Javascript Basics Quiz",
        description: "This is a basics level Javascript Quiz number 1",
        category: "JAVASCRIPT",
        difficulty: "BASICS",
        points_required: 100,
        num_questions: 3,
        quiz_img: "/images/quizzes/JS-BASICS.jpg",
        isVisible: true,
        question: [
          arrayQuestionsID[5],
          arrayQuestionsID[6],
          arrayQuestionsID[7],
          arrayQuestionsID[8],
          arrayQuestionsID[9],
        ],
      },
      {
        title: "Javascript Intermediate Quiz",
        description: "This is a intermediate level Javascript Quiz number 2",
        category: "JAVASCRIPT",
        difficulty: "INTERMEDIATE",
        points_required: 250,
        num_questions: 10,
        quiz_img: "/images/quizzes/JS-INTERMEDIATE.jpg",
        isVisible: true,
        question: [
          arrayQuestionsID[0],
          arrayQuestionsID[1],
          arrayQuestionsID[2],
          arrayQuestionsID[3],
          arrayQuestionsID[4],
          arrayQuestionsID[5],
          arrayQuestionsID[6],
          arrayQuestionsID[7],
          arrayQuestionsID[8],
          arrayQuestionsID[9],
        ],
      },
    ];
    return Quiz.insertMany(quizzes);
  })
  .then(() => {
    console.log("Seed done 🌱");
  })
  .catch((e) => console.log(e))
  .finally(() => {
    console.log("Closing connection");
    mongoose.connection.close();
  });
