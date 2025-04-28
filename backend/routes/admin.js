// const express = require("express");
// const User = require("../models/User");

// const router = express.Router();

// // GET /admin/user-count
// router.get("/user-count", async (req, res) => {
//   try {
//     const userCount = await User.countDocuments();
//     res.json({ count: userCount });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to get user count" });
//   }
// });

// // GET /admin/active-subscription-count (for embedded subscriptions)
// router.get("/active-subscription-count", async (req, res) => {
//   try {
//     const today = new Date();

//     const activeCount = await User.countDocuments({
//       "subscription.active": true,
//       "subscription.startDate": { $lte: today },
//       "subscription.endDate": { $gte: today },
//     });

//     res.json({ count: activeCount });
//   } catch (err) {
//     console.error("Error in active-subscription-count:", err);
//     res.status(500).json({ error: "Failed to get active subscription count" });
//   }
// });


// // Get all users
// router.get("/all-users", async (req, res) => {
//   try {
//     const users = await User.find({}, "-password"); // don't return password
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// });


// module.exports = router;




const express = require("express");
const User = require("../models/User");

const router = express.Router();

// GET /admin/user-count
router.get("/user-count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user count" });
  }
});

// GET /admin/active-subscription-count
router.get("/active-subscription-count", async (req, res) => {
  try {
    const today = new Date();

    const activeCount = await User.countDocuments({
      "subscription.active": true,
      "subscription.startDate": { $lte: today },
      "subscription.endDate": { $gte: today },
    });

    res.json({ count: activeCount });
  } catch (err) {
    console.error("Error in active-subscription-count:", err);
    res.status(500).json({ error: "Failed to get active subscription count" });
  }
});

// GET /admin/users (was all-users)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
