require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const contactRoutes = require("./routes/contact");
const careerRoutes = require("./routes/careers");
const solutionRoutes = require("./routes/solutions");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

let mongoPromise;
function connectMongo() {
  if (!process.env.MONGODB_URI) {
    return Promise.resolve(false);
  }

  if (!mongoPromise) {
    mongoPromise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .catch((error) => {
        mongoPromise = null;
        throw error;
      });
  }

  return mongoPromise;
}

app.use(async (req, res, next) => {
  if (!req.path.startsWith("/api")) {
    return next();
  }

  try {
    const connected = await connectMongo();
    if (connected === false) {
      req.mongoUnavailable = true;
    }
    return next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    req.mongoUnavailable = true;
    return next();
  }
});

app.get("/api/health", async (req, res) => {
  let dbStatus = "not_configured";

  if (process.env.MONGODB_URI) {
    try {
      await connectMongo();
      dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    } catch (error) {
      dbStatus = "error";
    }
  }

  return res.status(200).json({
    success: true,
    message: "API is running.",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/contact", contactRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/solutions", solutionRoutes);

app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.get("/our-story", (req, res) => res.sendFile(path.join(publicDir, "our-story.html")));
app.get("/solutions", (req, res) => res.sendFile(path.join(publicDir, "solutions.html")));
app.get("/what-we-offer", (req, res) => res.sendFile(path.join(publicDir, "what-we-offer.html")));
app.get("/career", (req, res) => res.sendFile(path.join(publicDir, "career.html")));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "API route not found." });
  }
  return res.sendFile(path.join(publicDir, "index.html"));
});

const port = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`ABC Solutions company site running on http://localhost:${port}`);
  });
}

module.exports = app;
