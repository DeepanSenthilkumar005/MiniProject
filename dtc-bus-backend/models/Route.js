
const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  timeDifference: { type: Number, default: 5 } // Time difference in minutes
});

const RouteSchema = new mongoose.Schema({
  name: String,
  number: String,
  stops: [StopSchema]
});

const Routes = mongoose.model("Route", RouteSchema);
module.exports = Routes;
