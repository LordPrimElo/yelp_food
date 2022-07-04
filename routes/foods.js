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
		req.flash("success", `Food Item Added - ${newFoodItem.title} created! Nice job!`)
		res.redirect("/foods/" + food_item._id)
	} catch (err) {
		req.flash("error", "Couldn't add food item, please try again.")
		res.redirect("back")
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


// Genre (Show but *different*)
router.get("/genre/:genre", async (req, res) => {
	try {
		const validGenres = ["indian", "thai", "italian", "american", "carribean", "chinese", "continental"]

		if (validGenres.includes(req.params.genre.toLowerCase())) {
			const foodstuffs = await foodItem.find({genre: req.params.genre}).exec()
			res.render("foodstuffs", {foodstuffs})
		} else {
			res.send("nah fam, we don't got dat food here")
		}
	} catch (e) {console.log(e)}
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
		await foodItem.findByIdAndUpdate(req.params.id, updatedNewFoodItem, {new: true}).exec()
		req.flash("success", `${updatedNewFoodItem.title} editted! Let's go!`)
		res.redirect("/foods/"+ req.params.id)
	} catch (err) {
		req.flash("error", "Couldn't edit the food item, please try again!")
		res.redirect("back")
	}
	
})

// Delete
router.delete("/:id", isLoggedIn, isFoodOwner, async (req, res) => {
	try {
		const deletedFoodItem = await foodItem.findByIdAndDelete(req.params.id).exec()
		console.log("Deleted: ", deletedFoodItem)
		req.flash("success", "You have become Death, the destroyer of food items...")
		res.redirect("/foods")
		
	} catch (err) {
		req.flash("error", "Couldn't delete food item, please try again!")
		res.redirect("back")
}})


module.exports = router










