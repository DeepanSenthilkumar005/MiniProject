const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stops: { type: [String], required: true }
});

module.exports = mongoose.model("Route", RouteSchema);
