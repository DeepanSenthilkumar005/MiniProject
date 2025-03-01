const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: String,      // Stop name (e.g., "Central Bus Stand")
  latitude: Number,  // GPS Latitude
  longitude: Number, // GPS Longitude
  buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }] // Buses using this stop
});

const Stop = mongoose.model("Stop", stopSchema);
module.exports = Stop;
