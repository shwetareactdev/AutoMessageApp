const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to authenticate user using JWT
const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  
  // Check if the token is provided
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token from authorization header
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user from the decoded token
    req.user = await User.findById(decoded.id);
    
    // If user not found, return error
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Set Subscription
router.post("/", authMiddleware, async (req, res) => {
  const { plan, type } = req.body;

  if (!plan || !type) {
    return res.status(400).json({ error: "Plan and type are required" });
  }

  if (req.user.isAdmin) {
    return res.status(403).json({ error: "Admin does not need subscription" });
  }

  const now = new Date();
  let end = new Date(now);

  if (type === "monthly") {
    end.setDate(end.getDate() + 31);
  } else if (type === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  }

  try {
    req.user.subscription = {
      plan,
      type,
      active: true,
      startDate: now,
      endDate: end,
    };
    await req.user.save();

    res.json({ message: "Subscription activated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to activate subscription" });
  }
});


// Get Subscription
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Return the user's subscription details
    res.json({ subscription: req.user.subscription });
  } catch (err) {
    console.error("Error fetching subscription:", err);
    res.status(500).json({ error: "Failed to fetch subscription details" });
  }
});

module.exports = router;
