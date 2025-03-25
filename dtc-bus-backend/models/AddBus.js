const mongoose = require("mongoose");

const busListSchema = new mongoose.Schema({
  routeNumber: { type: Number, required: true },
  details: [
    {
      name: { type: String, required: true },
      regNumber: { type: String, required: true },
      number: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("BusList", busListSchema);
