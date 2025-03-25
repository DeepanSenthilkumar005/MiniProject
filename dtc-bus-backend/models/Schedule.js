const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  departureTime: { type: Date, required: true },
  schedule: [
    {
      stop: String,
      time: String,
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
