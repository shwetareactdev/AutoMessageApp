// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   subscription: {
//     plan: { type: String, required: true },   // gold/premium
//     type: { type: String, required: true },   // monthly/yearly
//     active: { type: Boolean, default: false } // default is inactive
//   }
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String },
  phoneNumber: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  subscription: {
    plan: { type: String },
    type: { type: String },
    active: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
});

module.exports = mongoose.model("User", userSchema);

