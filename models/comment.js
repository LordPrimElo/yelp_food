const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: String,
  },
  text: String,
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodItem",
  },
});

module.exports = mongoose.model("comment", commentSchema);
