const express = require("express")
const router = express.Router()
const foodItem = require("../models/food_item")
const Comment = require("../models/comment")
const User = require("../models/user")
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
		},
		upvotes: [req.user.username],
		downvotes: [],
		savedByUsers: [],
		recipe: req.body.recipe
	}
	
	try {
		const food_item = await foodItem.create(newFoodItem)
		req.flash("success", `Food Item Added - ${newFoodItem.title} created! Nice job!`)
		res.redirect("/foods/" + food_item._id)
	} catch (err) {
		req.flash("error", "Couldn't add food item, please try again.")
		res.redirect("/foods")
	}	
})

// New
router.get("/new", isLoggedIn, (req, res) => {
	res.render("foods_new")
})

// Vote
router.post("/vote", isLoggedIn, async (req, res) => {
	const food = await foodItem.findById(req.body.foodId)

	const hasAlreadyUpvoted = food.upvotes.indexOf(req.user.username)
	const hasAlreadyDownvoted = food.downvotes.indexOf(req.user.username)

	const votingError = () => {
		req.flash("error", "Please try voting again! We're sorry for the inconvenience :(")
		res.redirect("/foods")
		response = {message: "err"}
	}

	let response = {message: ""}

	// Voting Logic
	if (hasAlreadyUpvoted === -1 && hasAlreadyDownvoted === -1) {
		if (req.body.voteType === "up") {
			food.upvotes.push(req.user.username)
			food.save()
			response = {
				message: "Upvote tallied!",
				code: 1
			}

		} else if (req.body.voteType === "down") {
			food.downvotes.push(req.user.username)
			food.save()
			response = {
				message: "Downvote tallied!",
				code: -1
			}

		} else {
			votingError()
		}
	} else if (hasAlreadyUpvoted > -1) {
		food.upvotes.splice(hasAlreadyUpvoted, 1)

		if (req.body.voteType === "up") {
			food.save()
			response = {
				message: "Upvote removed!",
				code: 0
			}

		} else if (req.body.voteType === "down") {
			food.downvotes.push(req.user.username)
			food.save()
			response = {
				message: "Changed to downvote!",
				code: -1
			}

		} else {
			votingError()
		}
	} else if (hasAlreadyDownvoted > -1) {
		food.downvotes.splice(hasAlreadyDownvoted, 1)

		if (req.body.voteType === "up") {
			food.upvotes.push(req.user.username)
			food.save()
			response = {
				message: "Changed to upvote",
				code: 1
			}

		} else if (req.body.voteType === "down") {
			food.save()
			response = {
				message: "Downvote removed!",
				code: 0
			}

		} else {
			votingError()
		}
	} else {
		votingError()
	}

	response.score = food.upvotes.length - food.downvotes.length

	res.json(response)

})

// Saved
router.get("/saved", isLoggedIn, async (req, res) => {
	// Get foods saved by user	
	const savedFoods = await foodItem.find({savedByUsers: req.user.username}).exec()

	// Show them on index page
	res.render("foodstuffs", {foodstuffs: savedFoods})
}) 

// Save
router.put("/:id/save", isLoggedIn, async (req, res) => {
	const food = await foodItem.findById(req.params.id).exec()

	const isSavedByUser = food.savedByUsers.indexOf(req.user.username)
	
	if (isSavedByUser === -1) {

		const newSaved = { 
			title: food.title,
			description: food.description,
			flavours: food.flavours,
			genre: food.genre,
			prepTime: food.prepTime,
			ingredients: food.ingredients,
			calories: food.calories,
			isHealthy: !!food.isHealthy,
			upvotes: food.upvotes,
			downvotes: food.downvotes,
			image: food.image,
			savedByUsers: food.savedByUsers.concat(req.user.username),
			recipe: food.recipe
		}

		await foodItem.findByIdAndUpdate(req.params.id, newSaved, {new: true}).exec()
		req.flash("success", "Saved this food item!")
		res.redirect("/foods/saved")

	} else if (isSavedByUser > -1) {
		food.savedByUsers.splice(isSavedByUser, 1)
		const newSaved = { 
			title: food.title,
			description: food.description,
			flavours: food.flavours,
			genre: food.genre,
			prepTime: food.prepTime,
			ingredients: food.ingredients,
			calories: food.calories,
			isHealthy: !!food.isHealthy,
			upvotes: food.upvotes,
			downvotes: food.downvotes,
			image: food.image,
			savedByUsers: food.savedByUsers,
			recipe: food.recipe
		}

		await foodItem.findByIdAndUpdate(req.params.id, newSaved, {new: true}).exec()
		req.flash("error", "Unsaved this food item!")
		res.redirect("/foods/saved")

	} else {
		req.flash("error", "You have already saved that!")
		res.redirect("/foods/saved")
	}
	

	

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
		const user = await User.findById(food.owner.id).exec()
		res.render("foods_show", {food, comments, owner: user.username})
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
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes,
			image: req.body.image,
			savedByUsers: req.body.savedByUsers,
			recipe: req.body.recipe
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
		req.flash("success", "You have become Death, the destroyer of food items...")
		res.redirect("/foods")
		
	} catch (err) {
		req.flash("error", "Couldn't delete food item, please try again!")
		res.redirect("back")
}})


module.exports = router










