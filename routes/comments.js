const express = require("express")
const router = express.Router({mergeParams: true})
const Comment = require("../models/comment")
const foodItem = require("../models/food_item")
const isLoggedIn = require("../utils/isLoggedIn")
const isCommentOwner = require("../utils/isCommentOwner")

// New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {foodId: req.params.id})
})

// Create
router.post("/", isLoggedIn, async (req, res) => {
	
	try {
		const comment = await Comment.create({
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		text: req.body.text,
		foodId: req.body.foodId
		})

		res.redirect(`/foods/${req.body.foodId}`)
		
	} catch (err) {
		console.log(err)
		res.redirect(`/foods/${req.body.foodId}`)
	}
})

// Edit
router.get("/:commentId/edit", isLoggedIn, isCommentOwner, async (req, res) => {
		const comment = await Comment.findById(req.params.commentId).exec()
		const food = await foodItem.findById(req.params.id).exec()
		
		res.render("comments_edit", {comment, food})
		
})

// Update
router.put("/:commentId", isLoggedIn, isCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true})
		res.redirect(`/foods/${req.params.id}`)
		
		
	} catch (err) {
		console.log("Brokkkkkeeeeeeeeeeeeeeeeeeeeeee comment PUT")
	}
})

// Delete
router.delete("/:commentId", isLoggedIn, isCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId)
		res.redirect("/foods/" + req.params.id)
	} catch (err) {
		res.send("BROKENAGIAN NAGFIDPGJDK DELETE ROPUTEEJITUH " + err)
	}
})



module.exports = router