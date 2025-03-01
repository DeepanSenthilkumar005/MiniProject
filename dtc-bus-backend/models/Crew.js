const mongoose = require("mongoose");

const CrewSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busName: { type: String, required: true },
  crew: [
    {
      role: { type: String, required: true },
      name: { type: String, required: true },
      contact: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Crew", CrewSchema);
