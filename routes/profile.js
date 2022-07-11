const router = require("express").Router();

// @desc    Show profile page of a user
// @route   GET /profile
// @access  Private
router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  if (user.role === "admin") {
    res.render("profile/admin-profile", { user });
  } else {
    res.render("profile/profile", { user });
  }
});

module.exports = router;
