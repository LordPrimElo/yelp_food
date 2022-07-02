const express = require("express")
const router = express.Router()
const foodItem = require("../models/food_item")
const Comment = require("../models/comment")
const isLoggedIn = require("../utils/isLoggedIn")
const isFoodOwner = require("../utils/isFoodOwner")

// Index
router.get("/", async (req, res) => {
	try {
		const foodstuffs = await foodItem.find().exec()
		res.render("foodstuffs", {foodstuffs})
	} catch (err) {res.send(err)}
	
	
	
	
})

// Create
router.post("/", isLoggedIn, async (req, res) => {
	

	
	const genre = req.body.genre.toLowerCase()
	
	const newFoodItem = {
		title: req.body.title,
		description: req.body.description,
		flavours: req.body.flavours,
		genre,
		prepTime: req.body.prepTime,
		ingredients: req.body.ingredients,
		calories: req.body.calories,
		isHealthy: !!req.body.isHealthy,
		image: req.body.image,
		owner: {
			id: req.user._id,
			username: req.body.username
		}
	}
	
	try {
		const food_item = await foodItem.create(newFoodItem)
		res.redirect("/foods/" + food_item._id)
	} catch (err) {
		res.send("create route err" + err)
	}	
})

// New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("foods_new")
})

// Search
router.get("/search", async (req, res) => {
	try {
		const foodstuffs = await foodItem.find({
			$text: {
				$search: req.query.term
			}
		})
		res.render("foodstuffs", {foodstuffs})
			
	} catch (err) {res.send("search broke => " + err)}
})


// Show
router.get("/:id", async (req, res) => {
	
	
	try {
		const food = await foodItem.findById(req.params.id).exec()
		const comments = await Comment.find({foodId: req.params.id})
		res.render("foods_show", {food, comments})
		} catch (err) {res.send("SHOW" + err)}
})


// Edit
router.get("/:id/edit", isLoggedIn, isFoodOwner, async (req, res) => {
	const food = await foodItem.findById(req.params.id).exec()
	res.render("foods_edit", {food})
	
	
	
		
})

// Update
router.put("/:id", isLoggedIn, isFoodOwner, async (req, res) => {
	
		const genre = req.body.genre.toLowerCase()
		
		const updatedNewFoodItem = {
			title: req.body.title,
			description: req.body.description,
			flavours: req.body.flavours,
			genre,
			prepTime: req.body.prepTime,
			ingredients: req.body.ingredients,
			calories: req.body.calories,
			isHealthy: !!req.body.isHealthy,
			image: req.body.image
		}

	try {
		const updatedFooditem = await foodItem.findByIdAndUpdate(req.params.id, updatedNewFoodItem, {new: true}).exec()
		res.redirect("/foods/"+ req.params.id)
	} catch (err) {res.send( "UPDATE" + err)}
	
})

// Delete
router.delete("/:id", isLoggedIn, isFoodOwner, async (req, res) => {
	try {
		const deletedFoodItem = await foodItem.findByIdAndDelete(req.params.id).exec()
		console.log("Deleted: ", deletedFoodItem)
		res.redirect("/foods")
	} catch (err) {res.send( err)}
})


module.exports = router










