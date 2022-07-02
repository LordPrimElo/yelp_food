const foodItem = require("../models/food_item")
const Comment = require("../models/comment")

const food_seeds = [
  {
    title: 'Gulab Jamun',
    description: 'Gulab jamun is a sweet confectionary or dessert, originating in the Indian subcontinent and a type of mithai popular in India, Pakistan, Nepal, the Maldives (where it is known as gulab ki janu), and Bangladesh, as well as Myanmar.',
    flavours: 'Sweet',
    genre: 'indian',
    prepTime: 120,
    ingredients: 'Milk Solids, Oil, Sugar Syrup',
    calories: 150,
    isHealthy: false,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg',

  },
  {
    title: 'Cheeseburger',
    description: 'A cheeseburger is a hamburger topped with cheese. Traditionally, the slice of cheese is placed on top of the meat patty. The cheese is usually added to the cooking hamburger patty shortly before se	rving, which allows the cheese to melt. Cheeseburgers can include variations in structure, ingredients and composition. As with other hamburgers, a cheeseburger may include toppings such as lettuce, tomato, onion, pickles, bacon, mayonnaise, ketchup, and mustard.',
    flavours: 'Savoury, Spicy',
    genre: 'american',
    prepTime: 30,
    ingredients: 'lettuce, tomato, onion, pickles, bacon, mayonnaise, ketchup, mustard',
    calories: 600,
    isHealthy: false,
    image: 'https://i0.wp.com/i.redd.it/lzh3ysy58np21.jpg?ssl=1',

  },
  {

    title: 'Prekmurska gibanica',
    description: 'Prekmurska gibanica is a type of Slovenian gibanica or layered pastry. It contains poppy seeds, walnuts, apples, raisins and quark fillings. Although native to Prekmurje, it has achieved the status of a national specialty of Slovenia. The unique sweetmeat shows the variety of agriculture in this region.',
    flavours: 'Sweet, Savoury',
    genre: 'continental',
    prepTime: 150,
    ingredients: ' Flour, poppy seeds, walnuts, apples, raisins, and quark',
    calories: 250,
    isHealthy: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/PrekmurskaGibanica1.JPG',

  }
]
	  
	  
const seed = async () => {
	await foodItem.deleteMany()
	console.log("Foods DELETED")
	
	await Comment.deleteMany()
	console.log("Comments DELETED")
	
	// for(const food_seed of food_seeds) {
	// 	let food_item = await foodItem.create(food_seed)
	// 	console.log(`Food Item CREATED: ${food_item.title}`)
		
	// 	await Comment.create({
	// 		text: "Amogus",
	// 		user: "Sussy BAKA",
	// 		foodId: food_item._id
	// 	})
	// 	console.log("Comment CREATED")
	// }
	// console.log("Foods SEEDED")
	
}

module.exports = seed