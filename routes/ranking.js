const router = require("express").Router();
const Game = require("../models/Game");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const { isLoggedIn, checkRoles } = require("../middlewares");

// @desc    App home page
// @route   GET /
// @access  Public
router.get("/", (req, res, next) => {
  res.render("ranking/ranking-selection");
});

//isLoggedIn,
// @desc    Displays the ranking
// @route   GET /ranking
// @access  Private
router.get("/:category", async (req, res, next) => {
  const { category } = req.params;

  console.log(category);

  // const enumValuesCategory = Quiz.schema.path("category").enumValues;
  let gamesPerUserAndCategory;
  const userDataByCategory = [];

  try {
    const games = await Game.find({ status: "DONE" })
      .populate({ path: "user" })
      .populate({ path: "quiz" });

    const allUsers = await User.find({ role: "player" });

    // enumValuesCategory.forEach(category => {

    // });

    allUsers.forEach((user) => {
      //console.log(user.id);

      gamesPerUserAndCategory = games.filter(function (game) {
        //console.log(game.user.id, user.id);
        return game.user.id === user.id && game.quiz.category === category;
      });

      //      console.log(game.user.username);
      //      console.log(game.total_points);
      // console.log(game.id);

      //console.log(usersWithPointsAdded);

      const userTotalPoints = gamesPerUserAndCategory.reduce(function (
        sum,
        game
      ) {
        // console.log(
        //   "accumulator is: ",
        //   sum,
        //   "and current value is: ",
        //   game.total_points,
        //   "return is: ",
        //   sum + game.total_points
        // );
        return sum + game.total_points;
      },
      0);

      // console.log(userTotalPoints);

      userDataByCategory.push({
        username: user.username,
        user_img: user.user_img,
        total_points: userTotalPoints,
        category: category,
        num_quizzes: gamesPerUserAndCategory.length
      });
    });

    console.log(userDataByCategory);

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
    console.log(userDataByCategory);

    userDataByCategory.forEach((user, index) => {
      userDataByCategory[index].position = index + 1;
    });

    console.log(userDataByCategory);

    res.render("ranking/ranking", { userDataByCategory });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
