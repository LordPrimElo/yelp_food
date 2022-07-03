const express = require("express")
const router = express.Router()
const User = ("../models/user")
const passport = require("passport")
const passportLocal = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")

// Sign Up NEW
router.get("/signup", (req, res) => {
	res.render("signup")
})

// Login Show
router.get("/login", (req, res) => {
	res.render("login", {message: req.flash("error")})
})

// Login
router.post("/login", passport.authenticate("local", {
	successRedirect: "/foods",
	failureRedirect: "/login"
}))

// Logout
router.get("/logout", (req, res) => {
	req.logout(err => res.send(err))
	res.redirect("/foods")
})




module.exports = router