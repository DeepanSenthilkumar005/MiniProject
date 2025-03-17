const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  mail: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 60  // Document will auto-delete after 60 seconds
  }
});

// Ensure the TTL index is created
loginSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("Login", loginSchema);
