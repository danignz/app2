const router = require("express").Router();
const Game = require("../models/Game");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const { isLoggedIn, checkRoles } = require("../middlewares");

// @desc    Displays ranking by category page
// @route   GET /ranking
// @access  Private
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("ranking/ranking-selection");
});

// @desc    Displays the ranking of a concrete category
// @route   GET /ranking/:category
// @access  Private
router.get("/:category", isLoggedIn, async (req, res, next) => {
  const { category } = req.params;

  let gamesPerUserAndCategory;
  const userDataByCategory = [];

  try {
    //Get all the finished Games in DB
    const games = await Game.find({ status: "DONE" })
      .populate({ path: "user" })
      .populate({ path: "quiz" });

    //Get all the players in DB
    const allUsers = await User.find({ role: "player" });

    //For every player
    allUsers.forEach((user) => {
      //Generate an array of objects with the data of every Game for a concrete category
      gamesPerUserAndCategory = games.filter(function (game) {
        return game.user.id === user.id && game.quiz.category === category;
      });

      //Calculate the sum of total points of all the Games of a concret user and category
      const userTotalPoints = gamesPerUserAndCategory.reduce(function (
        sum,
        game
      ) {
        return sum + game.total_points;
      },
      0);

      //Generate an array of objects with all the necessary data of a user to display in the ranking
      userDataByCategory.push({
        username: user.username,
        user_img: user.user_img,
        total_points: userTotalPoints,
        category: category,
        num_quizzes: gamesPerUserAndCategory.length,
      });
    });

    //Order in descending order by number of points
    userDataByCategory.sort((a, b) => {
      if (a.total_points < b.total_points) {
        return 1;
      }
      if (a.total_points > b.total_points) {
        return -1;
      }
      if (a.total_points === b.total_points) {
        return 0;
      }
    });

    //Need to aggregate position attribute due in arrays the index starts by 0 and we need by 1
    userDataByCategory.forEach((user, index) => {
      userDataByCategory[index].position = index + 1;
    });

    res.render("ranking/ranking", { userDataByCategory });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
