const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const foodItem = require("../models/food_item");
const isLoggedIn = require("../utils/isLoggedIn");
const isCommentOwner = require("../utils/isCommentOwner");

// New
router.get("/new", isLoggedIn, (req, res) => {
  res.render("comments_new", { foodId: req.params.id });
});

// Create
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.create({
      owner: {
        id: req.user._id,
        username: req.user.username,
      },
      text: req.body.text,
      foodId: req.body.foodId,
    });

    req.flash(
      "success",
      `Comment Added - ${comment.text} I respect your opinions, dude.`
    );

    res.redirect(`/foods/${req.body.foodId}`);
  } catch (err) {
    req.flash("error", "Couldn't add comment, please try again!");
    res.redirect(`/foods/${req.body.foodId}`);
  }
});

// Edit
router.get("/:commentId/edit", isLoggedIn, isCommentOwner, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).exec();
  const food = await foodItem.findById(req.params.id).exec();

  res.render("comments_edit", { comment, food });
});

// Update
router.put("/:commentId", isLoggedIn, isCommentOwner, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text: req.body.text },
      { new: true }
    );
    req.flash("success", `Comment editted!`);
    res.redirect(`/foods/${req.params.id}`);
  } catch (err) {
    req.flash("error", "Couldn't edit comment, please try again.");
    res.redirect("back");
  }
});

// Delete
router.delete("/:commentId", isLoggedIn, isCommentOwner, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash("success", `Holy Moly! You have deleted your comment!`);
    res.redirect("/foods/" + req.params.id);
  } catch (err) {
    req.flash("error", "Couldn't delete comment, please try again!");
    res.redirect("back");
  }
});

module.exports = router;
