const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Crew = require("../models/Crew"); // ✅ Import Crew Model

// ✅ Get All Schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("busId")
      .populate("routeId")
      .populate("driverId") // ✅ Populate Driver Details
      .populate("conductorId"); // ✅ Populate Conductor Details

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
});

// ✅ Add a New Schedule
router.post("/", async (req, res) => {
  try {
    const { busId, routeId, driverId, conductorId, departureTime } = req.body;

    // Check if bus, route, driver, and conductor exist
    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);
    const driver = await Crew.findById(driverId);
    const conductor = await Crew.findById(conductorId);

    if (!bus || !route || !driver || !conductor) {
      return res.status(404).json({ message: "Bus, Route, Driver, or Conductor not found" });
    }

    // Ensure route has stops
    if (!route.stops || route.stops.length === 0) {
      return res.status(400).json({ message: "Route has no stops defined" });
    }

    // Calculate schedule based on stops
    let startTime = new Date(departureTime);
    let schedule = route.stops.map((stop, index) => {
      let stopTime = new Date(startTime);
      stopTime.setMinutes(startTime.getMinutes() + index * (stop.timeDifference || 10)); // Default 10 min
      return {
        stop: stop.name,
        time: stopTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      };
    });

    // Save schedule
    const newSchedule = new Schedule({
      busId,
      routeId,
      driverId, // ✅ Save Driver ID
      conductorId, // ✅ Save Conductor ID
      departureTime,
      schedule,
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error adding schedule", error: error.message });
  }
});

module.exports = router;
