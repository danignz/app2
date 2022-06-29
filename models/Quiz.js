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
  difficulty: {
    type: String,
    enum: ["BASIC", "MEDIUM", "ADVANCE"],
    required: [true, "Difficulty is required"],
  },
  category: {
    type: String,
    enum: ["JAVASCRIPT", "CSS", "HTML"],
    required: [true, "Category is required"],
  },
  points_required: {
    type: Number,
    required: [true, "Poinst are required"],
  },
  question: {
    type: [Schema.Types.ObjectId],
    ref: 'Question',
    required: [true, "Questions are required"],
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
});

const Quiz = model("Quiz", quizSchema);

module.exports = Quiz;
