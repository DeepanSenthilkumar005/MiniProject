const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Crew", required: true }, // ✅ Added driver field
  conductorId: { type: mongoose.Schema.Types.ObjectId, ref: "Crew", required: true }, // ✅ Added conductor field
  departureTime: { type: Date, required: true },
  schedule: [
    {
      stop: String,
      time: String,
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
