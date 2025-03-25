const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  name:{
    type:String,
    required : [true],
    default : "No Name"
  },
  mail: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  role: { 
    type: String, 
    default:"Passenger"
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure TTL index is created (deletes after 60 seconds)
loginSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1440 });

module.exports = mongoose.model("Login", loginSchema);
