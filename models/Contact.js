const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, minlength: 10 },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["new", "read", "replied"], default: "new" }
});

module.exports = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
