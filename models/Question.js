const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  correct_answer: {
    type: String,
    required: [true, "Answer is required"],
  },
  incorrect_answers: {
    type: [String],
    required: [true, "Incorrect Answer is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
  },
  question_img: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const Question = model("Question", questionSchema);

module.exports = Question;
