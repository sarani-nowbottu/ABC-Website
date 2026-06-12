const express = require("express");
const JobListing = require("../../models/JobListing");
const JobApplication = require("../../models/JobApplication");
const { validateApplication } = require("../middleware/validate");

const router = express.Router();
const defaultJobs = [
  {
    role: "Core Banking Integration Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Dharmapuri (On-site)",
    isRemote: false,
    description: "You'll work directly on CBS platforms - integrations, customizations, data mapping, and deployment support. You know banking middleware and you're not afraid of legacy codebases.",
    requirements: ["2+ years in banking IT", "Java/Spring Boot", "CBS experience (Finacle or BaNCS preferred)"]
  },
  {
    role: "React Frontend Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
    isRemote: true,
    description: "You'll build and maintain client-facing dashboards and internal portals. Clean code, component reuse, and performance matter to us.",
    requirements: ["1+ years with React", "REST API integration", "Solid CSS skills"]
  },
  {
    role: "Business Analyst - Banking Domain",
    department: "Banking",
    type: "Full-time",
    location: "Dharmapuri (On-site)",
    isRemote: false,
    description: "You'll bridge the gap between our clients' banking operations and our technical teams. You should be able to read a BRD and translate it into a spec that developers actually use.",
    requirements: ["Banking domain experience", "Strong documentation skills", "Client-facing communication"]
  },
  {
    role: "HR Executive",
    department: "HR",
    type: "Full-time",
    location: "Dharmapuri (On-site)",
    isRemote: false,
    description: "Manage recruitment pipelines, onboarding, payroll coordination, and employee engagement. You should be organized and people-first.",
    requirements: ["1+ years in HR", "Familiarity with HRMS tools"]
  }
];

router.get("/", async (req, res) => {
  if (req.mongoUnavailable) {
    return res.status(200).json({ success: true, data: defaultJobs });
  }

  const filter = { isActive: true };

  if (req.query.dept) filter.department = req.query.dept;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.location) {
    filter.location = new RegExp(req.query.location, "i");
  }

  const jobs = await JobListing.find(filter).sort({ postedAt: -1 }).lean();
  return res.status(200).json({ success: true, data: jobs });
});

router.post("/apply", validateApplication, async (req, res) => {
  if (req.mongoUnavailable) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Set MONGODB_URI in your environment variables and allow network access in MongoDB Atlas."
    });
  }

  try {
    const application = await JobApplication.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      department: req.body.department,
      coverLetter: req.body.coverLetter,
      resumeBase64: req.body.resumeBase64
    });

    return res.status(201).json({
      success: true,
      message: "Application received. Our HR team will reach out within 5 business days.",
      id: application._id
    });
  } catch (error) {
    console.error("Career application error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not save your application. Please try again later."
    });
  }
});

module.exports = router;
