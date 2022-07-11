const router = require("express").Router();
const Game = require("../models/Game");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const { isLoggedIn, checkRoles } = require("../middlewares");

//isLoggedIn,
// @desc    Displays the ranking
// @route   GET /ranking
// @access  Private
router.get("/",  async (req, res, next) => {
  //const enumValuesCategory = Quiz.schema.path("category").enumValues;

  const category = "JAVASCRIPT";

  //   enumValuesCategory.forEach(category => {
  //     console.log(category);

  //   });

  let usersWithPointsAdded, userTotalPoints;
  try {

    const games = await Game.find({ status: "DONE" })
      .populate({ path: "user" })
      .populate({ path: "quiz" });

    const allUsers = await Game.find({}, { _id: 1 });

    allUsers.forEach(user => {
             //console.log(user.id);

             userTotalPoints = 0;
             usersWithPointsAdded = games.filter(function (game) {
                return ((game.id === user.id) && (game.quiz.category === category ))
              })



    

              //      console.log(game.user.username);
              //      console.log(game.total_points);
             // console.log(game.id);
             
             console.log(usersWithPointsAdded);

            const result = usersWithPointsAdded.reduce(function (sum, game) {
         //       console.log('accumulator is: ', sum, 'and current value is: ', pointsInGame.total_points, 'return is: ', sum + pointsInGame.total_points);  
                return sum + game.total_points;
              }, 0);
            
              
    
              console.log(result);
       
            //   username: game.user.username,
            //   total_points:
      
           });
          // console.log(usersWithPointsAdded);


   // console.log(games);
    //   res.render("quizzes/quizzes", { quizzes });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
