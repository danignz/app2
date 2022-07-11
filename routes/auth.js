const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { isLoggedIn, checkRoles } = require("../middlewares");
const fileUploader = require("../config/cloudinary.config");

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get("/signup", async (req, res, next) => {
  res.render("auth/signup");
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get("/login", async (req, res, next) => {
  res.render("auth/login");
});

// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post(
  "/signup",
  fileUploader.single("user_img"),
  async (req, res, next) => {
    const { email, password, username } = req.body;

    // Check if user introduced all values
    if (!email || !username || !password) {
      res.render("auth/signup", {
        error: "All fields are mandatory. Please fill them before submitting.",
      });
      return;
    }
    // Check is password meets requirements
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.render("auth/signup", {
        error:
          "Password must have lowercase letters, uppercase letters and at least one number.",
      });
      return;
    }

    let user_img;
    if (req.file) {
      user_img = req.file.path;
    } else {
      user_img = "/images/profile/default.jpg";
    }

    try {
      // Check if email exists on our DB
      const emailFromDB = await User.findOne({ email: email });
      // email can't be repeated
      if (emailFromDB) {
        res.render("auth/signup", {
          error: "Email is not avariable. Try with another one.",
        });
        return;
      }

      // Check if user exists on our DB
      const user = await User.findOne({ username: username });
      // Username can't be repeated
      if (user) {
        res.render("auth/signup", {
          error: "Username is not avariable. Try with another one.",
        });
        return;
      } else {
        // Generate salt
        const salt = await bcrypt.genSalt(saltRounds);
        // Use salt to hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
          username,
          email,
          hashedPassword,
          user_img: user_img,
        });
        res.redirect("/auth/login");
      }
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user introduced all values
  if (!email || !password) {
    res.render("auth/login", {
      error: "All fields are mandatory. Please fill them before submitting.",
    });
    return;
  }

  try {
    // Remember to assign user to session cookie:
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render("auth/login", { error: "User not found" });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { error: "Unable to authenticate user" });
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
