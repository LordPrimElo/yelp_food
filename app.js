// =============================================
// IMPORTS
// =============================================

// NPM Imports
const express =  require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const morgan = require("morgan")
const passport = require("passport")
const localStrategy = require("passport-local")
const expressSession = require("express-session")
const passportLocal = require("passport-local")

// Config Imports
const config = require("./config")

// Route Imports
const foodRoutes = require("./routes/foods")
const commentRoutes = require("./routes/comments")
const mainRoutes = require("./routes/main")
const authRoutes = require("./routes/auth")

// Model Imports
const foodItem = require("./models/food_item")
const Comment = require("./models/comment")
const User = require("./models/user")


// =============================================
// DEVELOPMENT
// =============================================
// Morgan
app.use(morgan("tiny"))

// Seed the DB
// const seed = require("./utils/seed")
// seed()


// =============================================
// CONFIGRATION
// =============================================
// Connect to DB
mongoose.connect(config.db.connection)

// Express Config
app.set("view engine", "ejs")
app.use(express.static("public"))

// Express Session Config
app.use(expressSession({
	secret: "53vb36768769876897689876098rtybp[547p[6[6;b7[o87[7o.5bbbbbbbbi.76io[/8bbbb5i.[78i[bbi57i.9b5p7o.[iok907*(78876(y87586586*(7(8soaiu0w9ot3o4il6876.474/9[76]))))]]]]]]]]]",
	resave: false,
	saveUninitialized: false
}))

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Method Override Config
app.use(methodOverride("_method"))

// Passport Config
app.use(passport.initialize())
app.use(passport.session()) // Session persistance
passport.serializeUser(User.serializeUser()) 	// Encodes data into the session (passport-local-mongoose)
passport.deserializeUser(User.deserializeUser())// Decodes data from the session (passport-local-mongoose)
const LocalStrategy = passportLocal.Strategy
passport.use(new LocalStrategy(User.authenticate()))

// Current User Middleware Config
app.use((req, res, next) => {
	res.locals.user = req.user
	next()
})

// Routes Config
app.use("/foods", foodRoutes)
app.use("/foods/:id/comments", commentRoutes)
app.use(authRoutes)
app.use(mainRoutes)

//==============================================
// Sign Up CREATE (Doesn't work as a router POST route [don't know why?] so it is here)
app.post("/signup", async (req, res) => {
	try {
		const newUser = await User.register(new User({
			username: req.body.username,
			email: req.body.email
			}), req.body.password)
		
		console.log(newUser)
		
		passport.authenticate("local")(req, res, () => {
			res.redirect("/foods")
		})
		
	} catch (err) {
		console.log(err)
	}
})
//==============================================

// =============================================
// LISTEN
// =============================================
app.listen(3000, () => {
	console.log("Yelp ripoff runnin' boys!")
})