const express = require("express");
const router = express.Router();
const isLoggedIn = require("../utils/isLoggedIn");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
