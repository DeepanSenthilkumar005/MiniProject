const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }, // Reference Bus Model
});

// Prevent model overwrite
const Stop = mongoose.models.Stop || mongoose.model("Stop", StopSchema);

module.exports = Stop;