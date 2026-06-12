const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  coverLetter: { type: String },
  resumeBase64: { type: String },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["received", "reviewing", "shortlisted", "rejected"], default: "received" }
});

module.exports = mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
