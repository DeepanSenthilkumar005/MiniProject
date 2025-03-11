const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stops: { type: [String], required: true },
    buses: [
        {
            busNumber: { type: String, required: true },
            timings: { type: String, required: true }, // Example: "08:00 AM - 10:00 AM"
            busType: { type: String, default: "Regular" } // Example: Express, AC, etc.
        }
    ],
    timings: { type: [Number], required: true }, // Time gaps between each stop
    haltTimes: { type: [Number], required: true } // Halt duration at each stop (in mins)
});

module.exports = mongoose.model("Route", RouteSchema);
