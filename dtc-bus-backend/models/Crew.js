const mongoose = require("mongoose");

const CrewSchema = new mongoose.Schema({
  role: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  mail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Crew", CrewSchema);
