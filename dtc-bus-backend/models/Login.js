const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  mail: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  createdAt: { type: Date, default: Date.now, expires: 60 }
});
module.exports = mongoose.model("Login", loginSchema);
