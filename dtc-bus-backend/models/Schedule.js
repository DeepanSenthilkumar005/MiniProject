const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  stops: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      interval: Number, // Interval in minutes (time taken from previous stop)
    },
  ],
  startTime: { type: String, required: true }, // Example: "08:00 AM"
});

module.exports = mongoose.model("Bus", busSchema);
