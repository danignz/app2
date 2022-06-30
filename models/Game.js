const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    status: {
      type: String,
      enum: ["NOT INIT", "IN PROGRESS", "DONE"],
      default: "NOT INIT",
    },
    current_question: {
      type: Number,
      default: -1,
    },
  },
  {
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
