const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema({
  role: { type: String, required: true },
  department: { type: String, required: true, enum: ["Engineering", "Banking", "HR", "Operations"] },
  type: { type: String, required: true, enum: ["Full-time", "Contract", "Internship"] },
  location: { type: String, required: true },
  isRemote: { type: Boolean, default: false },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.JobListing || mongoose.model("JobListing", jobListingSchema);
