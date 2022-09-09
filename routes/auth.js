const express = require("express");
const router = express.Router();
const User = "../models/user";
const passport = require("passport");
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

// Sign Up NEW
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Login Show
router.get("/login", (req, res) => {
  res.render("login");
});

// Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Logged you in successfully! :D",
  }),
  (req, res) => {
    try {
      req.flash("success", "Logged in, baby!");
      res.redirect("/foods");
    } catch (err) {
      req.flash("error", "Couldn't log you in :( \n Please try again!");
      res.redirect("back");
      console.log(err);
    }
  }
);

// Logout
router.get("/logout", (req, res) => {
  try {
    req.logout((err) => res.send(err));
    req.flash("success", "Logged you out successfully! :D");
    res.redirect("/foods");
  } catch (err) {
    req.flash("error", "Couldn't log you out :( \n Please try again!");
    req.redirect("back");
  }
});

module.exports = router;
