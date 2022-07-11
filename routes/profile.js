const router = require("express").Router();
const User = require("../models/User");
const fileUploader = require("../config/cloudinary.config");

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

// @desc    Displays form to edit some data fields of a user
// @route   GET /profile/userId/edit
// @access  Private
router.get("/:userId/edit", isLoggedIn, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.render("profile/edit-profile", {
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Manage the data received from the form to upload user profile's picture in DB
// @route   POST /profile/userId/edit
// @access  Private
router.post(
  "/:userId/edit",
  isLoggedIn,
  fileUploader.single("user_img"),
  async (req, res, next) => {
    const { userId } = req.params;
    const { existingImage } = req.body;

    let user_img;
    if (req.file) {
      user_img = req.file.path;
    } else {
      user_img = existingImage;
    }

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          user_img: user_img,
        },
        { new: true }
      );

      //update user's cookie with new image
      req.session.currentUser = user;

      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
