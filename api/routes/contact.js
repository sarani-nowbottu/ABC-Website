const express = require("express");
const Contact = require("../../models/Contact");
const { validateContact } = require("../middleware/validate");

const router = express.Router();

router.post("/", validateContact, async (req, res) => {
  if (req.mongoUnavailable) {
    return res.status(503).json({
      success: false,
      message: "Database is not connected. Set MONGODB_URI in your environment variables and allow network access in MongoDB Atlas."
    });
  }

  try {
    const contact = await Contact.create({
      fullName: req.body.fullName,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been received. We'll get back to you within 24 hours.",
      id: contact._id
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not save your message. Please try again later."
    });
  }
});

module.exports = router;
