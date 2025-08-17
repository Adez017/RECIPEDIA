const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  createdAt: { type: Date, default: Date.now }
});

likeSchema.index({ user: 1, recipe: 1 }, { unique: true });
likeSchema.index({ createdAt: 1 }); // for faster date filtering

module.exports = mongoose.model("Like", likeSchema);
