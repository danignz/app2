require("dotenv").config();
const mongoose = require("mongoose");

const Question = require("../models/Question");

const questions = [
  {
    question: "Do you know what will be the output of this code?",
    correct_answer: "[1, 2, 3, 4]",
    incorrect_answers: ["[4, 2, 1, 3]", "[4, 3, 2, 1]"],
    category: "JAVASCRIPT",
    difficulty: "MEDIUM",
    question_img: "/images/questions/JS-1.jpg",
    isVisible: true,
  },
];

mongoose
  .connect(process.env.MONGO_URL)
  .then((x) => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return Question.create(questions);
  })
  .then(() => {
    console.log("Seed done 🌱");
  })
  .catch((e) => console.log(e))
  .finally(() => {
    console.log("Closing connection");
    mongoose.connection.close();
  });
