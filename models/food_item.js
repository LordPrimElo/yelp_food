const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
	title: String,
	description: String,
	flavours: String,
	genre: String,
	prepTime: Number,
	ingredients: String,
	calories: Number,
	isHealthy: Boolean,
	image: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String]
})

foodSchema.index({
	"$**": "text"
})



module.exports = mongoose.model("food_item", foodSchema)