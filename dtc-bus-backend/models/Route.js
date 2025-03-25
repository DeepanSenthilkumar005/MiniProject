const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeNumber: { type: Number, required: true }, // Route Number (Not Unique)
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true }, // Reference to Bus Model
  busName: { type: String, required: true }, // Bus Name
  busNumber: { type: String, required: true }, // Bus Number
});

module.exports = mongoose.model("Route", routeSchema);
