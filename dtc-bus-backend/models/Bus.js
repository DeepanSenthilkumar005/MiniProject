const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  timeDifference: { type: Number, default: 5 } // Time difference in minutes
});

const BusSchema = new mongoose.Schema({
  name: String,
  number: String,
  stops: [StopSchema]
});

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
