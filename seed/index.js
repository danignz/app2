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
    difficulty: "INTERMEDIATE",
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
  {
    question: "How often does the function run?",
    correct_answer: "10 seconds",
    incorrect_answers: ["1 second", "100 seconds"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-11.jpg",
    isVisible: true,
  },
  {
    question: "what operation does it perform?",
    correct_answer: "Concatenation",
    incorrect_answers: ["Addition", "Subtraction"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-12.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "Sun",
    incorrect_answers: ["Hey", "Fail"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-13.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "Yellow",
    incorrect_answers: ["Space", "Space:Yellow"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-14.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "Don",
    incorrect_answers: ["Don'", "Space:Do"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-15.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "true",
    incorrect_answers: ["false", "ERROR"],
    category: "JAVASCRIPT",
    difficulty: "BASICS",
    question_img: "/images/questions/JS-16.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "Sandra",
    incorrect_answers: ["SANDRA", "SAndra"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-17.jpg",
    isVisible: true,
  },
  {
    question: "what is the solution?",
    correct_answer: "['a','b','c']",
    incorrect_answers: ["[abc]", "ERROR"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-18.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "0",
    incorrect_answers: ["2", "9"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-19.jpg",
    isVisible: true,
  },
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "0 OR 1",
    incorrect_answers: ["0 OR 1 OR 2", "ERROR"],
    category: "JAVASCRIPT",
    difficulty: "INTERMEDIATE",
    question_img: "/images/questions/JS-20.jpg",
    isVisible: true,
  },
  {
    question: "Who is making the Web standards?",
    correct_answer: "The WWW Consortium",
    incorrect_answers: ["Mozilla", "Microsoft"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-1.png",
    isVisible: true,
  },
  {
    question: "HTML links can be styled using ___.",
    correct_answer: "CSS",
    incorrect_answers: ["JavaScript", "XML"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-2.png",
    isVisible: true,
  },
  {
    question: "There are ___ types of heading tags available in HTML.",
    correct_answer: "6",
    incorrect_answers: ["8", "5"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-3.png",
    isVisible: true,
  },
  {
    question: "< br / > What type of tag is this?",
    correct_answer: "Break tag",
    incorrect_answers: ["A broken tag", "An opening tag"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-4.png",
    isVisible: true,
  },
  {
    question: "Choose the correct HTML element to define emphasized text",
    correct_answer: "<em>",
    incorrect_answers: ["<italic>", "<i>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-5.png",
    isVisible: true,
  },
  {
    question: "How can you make a numbered list?",
    correct_answer: "<ol>",
    incorrect_answers: ["<ul>", "<nl>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-6.png",
    isVisible: true,
  },
  {
    question: "What is the correct HTML for making a checkbox?",
    correct_answer: "<input type='checkbox'>",
    incorrect_answers: ["<input form='checkbox'>", "<checkbox>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-7.png",
    isVisible: true,
  },
  {
    question: "Which HTML element defines the title of a document?",
    correct_answer: "<title>",
    incorrect_answers: ["<head>", "<body>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-8.png",
    isVisible: true,
  },
  {
    question: "What is the correct HTML element for playing video files?",
    correct_answer: "<video>",
    incorrect_answers: ["<movie>", "<media>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-9.png",
    isVisible: true,
  },
  {
    question: "What is the correct HTML element for playing audio files?",
    correct_answer: "<audio>",
    incorrect_answers: ["<sound>", "<mp3>"],
    category: "HTML",
    difficulty: "BASICS",
    question_img: "/images/questions/HTML-10.png",
    isVisible: true,
  },
  {
    question: "What does it mean CSS?",
    correct_answer: "Cascading Style Sheets",
    incorrect_answers: ["Code of Style Sheets", "Color Style Sheets"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-1.png",
    isVisible: true,
  },
  {
    question: "How can we add a comment in CSS?",
    correct_answer: "/*  */",
    incorrect_answers: ["//", "<!-- -->"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-2.png",
    isVisible: true,
  },
  {
    question: "In which section of the HTML page do we define the internal CSS style sheet?",
    correct_answer: "<head>",
    incorrect_answers: ["<footer>", "<body>"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-3.png",
    isVisible: true,
  },
  {
    question: "How would you write a class in CSS?",
    correct_answer: ".card-container {}",
    incorrect_answers: ["card-container {}", ":card-container {}"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-4.png",
    isVisible: true,
  },
  {
    question: "How would you write an id in CSS?",
    correct_answer: "#identifier {}",
    incorrect_answers: [":identifier {}", "identifier {}"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-5.png",
    isVisible: true,
  },
  {
    question: "How would you write a tag in CSS?",
    correct_answer: "div",
    incorrect_answers: ["#div", ":div"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-6.png",
    isVisible: true,
  },
  {
    question: "What is the viewport height tag in CSS ?",
    correct_answer: "VH",
    incorrect_answers: ["VW", "REM"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-7.png",
    isVisible: true,
  },
  {
    question: "What tag is used to round the edges of a shape?",
    correct_answer: "border-radius: ;",
    incorrect_answers: ["border: ;", "rounded: ;"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-8.png",
    isVisible: true,
  },
  {
    question: "What tag is used to put a colored border?",
    correct_answer: "border: ;",
    incorrect_answers: ["color: ;", "border-radius: ;"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-9.png",
    isVisible: true,
  },
  {
    question: "What tag is used to add padding to the top side only?",
    correct_answer: "padding-top: ;",
    incorrect_answers: ["padding-bottom: ;", "padding: ;"],
    category: "CSS",
    difficulty: "BASICS",
    question_img: "/images/questions/CSS-10.png",
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
        points_required: 0,
        num_questions: 10,
        quiz_img: "/images/quizzes/js.png",
        isVisible: true,
        question: [
          arrayQuestionsID[1],
          arrayQuestionsID[6],
          arrayQuestionsID[7],
          arrayQuestionsID[8],
          arrayQuestionsID[9],
          arrayQuestionsID[10],
          arrayQuestionsID[16],
          arrayQuestionsID[17],
          arrayQuestionsID[18],
          arrayQuestionsID[19],
        ],
      },
      {
        title: "Javascript Intermediate Quiz",
        description: "This is a intermediate level Javascript Quiz number 2",
        category: "JAVASCRIPT",
        difficulty: "INTERMEDIATE",
        points_required: 6,
        num_questions: 10,
        quiz_img: "/images/quizzes/js.png",
        isVisible: true,
        question: [
          arrayQuestionsID[0],
          arrayQuestionsID[2],
          arrayQuestionsID[3],
          arrayQuestionsID[4],
          arrayQuestionsID[5],
          arrayQuestionsID[11],
          arrayQuestionsID[12],
          arrayQuestionsID[13],
          arrayQuestionsID[14],
          arrayQuestionsID[15],
        ],
      },
      {
        title: "HTML Basics Quiz",
        description: "This is a basics level HTML Quiz number 1",
        category: "HTML",
        difficulty: "BASICS",
        points_required: 0,
        num_questions: 10,
        quiz_img: "/images/quizzes/html.png",
        isVisible: true,
        question: [
          arrayQuestionsID[20],
          arrayQuestionsID[21],
          arrayQuestionsID[22],
          arrayQuestionsID[23],
          arrayQuestionsID[24],
          arrayQuestionsID[25],
          arrayQuestionsID[26],
          arrayQuestionsID[27],
          arrayQuestionsID[28],
          arrayQuestionsID[29],
        ],
      },
      {
        title: "CSS Basics Quiz",
        description: "This is a basics level CSS Quiz number 1",
        category: "CSS",
        difficulty: "BASICS",
        points_required: 0,
        num_questions: 10,
        quiz_img: "/images/quizzes/css.png",
        isVisible: true,
        question: [
          arrayQuestionsID[30],
          arrayQuestionsID[31],
          arrayQuestionsID[32],
          arrayQuestionsID[33],
          arrayQuestionsID[34],
          arrayQuestionsID[35],
          arrayQuestionsID[36],
          arrayQuestionsID[37],
          arrayQuestionsID[38],
          arrayQuestionsID[39],
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
