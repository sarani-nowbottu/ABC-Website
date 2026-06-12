const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }]
});

module.exports = mongoose.models.Solution || mongoose.model("Solution", solutionSchema);
