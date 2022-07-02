const foodItem = require("../models/food_item")

const isFoodOwner = async (req, res, next) => {
	const food = await foodItem.findById(req.params.id).exec()
		
		if (food.owner.id.equals(req.user._id)) {
			next()

		} else {
			res.redirect("back")
		}
}

module.exports = isFoodOwner