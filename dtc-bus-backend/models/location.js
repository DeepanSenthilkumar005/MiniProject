const mongoose = require("mongoose");

const BusLocationSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true, // Ensures one active location per driver
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Updates on each location update
  },
});

const BusLocation = mongoose.model("BusLocation", BusLocationSchema);

module.exports = BusLocation;
