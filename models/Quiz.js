const { Schema, model } = require("mongoose");

const quizSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
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
    enum: ["BASICS", "INTERMEDIATE", "ADVANCED"],
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
