const express = require("express");
const router = express.Router();
const axios = require("axios");
const Schedule = require("../models/Schedule");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Crew = require("../models/Crew");

// ✅ GET All Schedules (unchanged)
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("busId")
      .populate("routeId")
      .populate("driverId")
      .populate("conductorId");

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error: error.message });
  }
});

// ✅ POST: Add a New Schedule + Email to Crew
router.post("/", async (req, res) => {
  try {
    const { busId, routeId, driverId, conductorId, departureTime } = req.body;

    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);
    const driver = await Crew.findById(driverId);
    const conductor = await Crew.findById(conductorId);

    if (!bus || !route || !driver || !conductor) {
      return res.status(404).json({ message: "Bus, Route, Driver, or Conductor not found" });
    }

    if (!route.stops || route.stops.length === 0) {
      return res.status(400).json({ message: "Route has no stops defined" });
    }

    let startTime = new Date(departureTime);
    let schedule = route.stops.map((stop, index) => {
      let stopTime = new Date(startTime);
      stopTime.setMinutes(startTime.getMinutes() + index * (stop.timeDifference || 10));
      return {
        stop: stop.name,
        time: stopTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

    const newSchedule = new Schedule({
      busId,
      routeId,
      driverId,
      conductorId,
      departureTime,
      schedule,
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      newSchedule,
      driver,
      conductor,
      bus,
      route,
    });
  } catch (error) {
    console.error("❌ Error adding schedule:", error);
    res.status(500).json({ message: "Error adding schedule", error: error.message });
  }
});


module.exports = router;
