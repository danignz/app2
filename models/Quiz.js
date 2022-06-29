const { Schema, model } = require("mongoose");

const quizSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    enum: ["JAVASCRIPT", "CSS", "HTML"],
    required: [true, "Category is required"],
  },
  difficulty: {
    type: String,
    enum: ["BASIC", "MEDIUM", "ADVANCE"],
    required: [true, "Difficulty is required"],
  },
  points_required: {
    type: Number,
    required: [true, "Points are required"],
  },
  num_questions: {
    type: Number,
    required: [true, "Number of questions are required"],
  },
  quiz_img: {
    type: String,
    default: "/images/quizzes/default.jpg",
  },
  isVisible: {
    type: Boolean,
  },
  question: {
    type: [Schema.Types.ObjectId],
    ref: "Question",
    required: [true, "Questions are required"],
  },
});

const Quiz = model("Quiz", quizSchema);

module.exports = Quiz;
