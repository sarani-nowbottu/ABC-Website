const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(req, res, next) {
  const { fullName, email, subject, message } = req.body;
  const errors = [];

  if (!fullName || !fullName.trim()) errors.push({ field: "fullName", message: "Full name is required." });
  if (!email || !emailRegex.test(email)) errors.push({ field: "email", message: "Enter a valid email address." });
  if (!subject || !subject.trim()) errors.push({ field: "subject", message: "Subject is required." });
  if (!message || message.trim().length < 10) errors.push({ field: "message", message: "Message must be at least 10 characters." });

  if (errors.length) return res.status(400).json({ success: false, errors });
  return next();
}

function validateApplication(req, res, next) {
  const { fullName, email, phone, role } = req.body;
  const errors = [];

  if (!fullName || !fullName.trim()) errors.push({ field: "fullName", message: "Full name is required." });
  if (!email || !emailRegex.test(email)) errors.push({ field: "email", message: "Enter a valid email address." });
  if (!phone || !phone.trim()) errors.push({ field: "phone", message: "Phone number is required." });
  if (!role || !role.trim()) errors.push({ field: "role", message: "Choose the role you are applying for." });

  if (errors.length) return res.status(400).json({ success: false, errors });
  return next();
}

module.exports = {
  validateApplication,
  validateContact
};
