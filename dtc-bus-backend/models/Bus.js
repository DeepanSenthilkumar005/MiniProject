const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true }, // Bus Name
  busNumber: { type: String, required: true }, // Bus Number
});

module.exports = mongoose.model("Bus", busSchema);