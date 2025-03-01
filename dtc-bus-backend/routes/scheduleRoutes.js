const express = require("express");
const Schedule = require("../models/Schedule");
const Stop = require("../models/Stop");

const router = express.Router();

// ✅ Get all bus schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("stops");
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new schedule
router.post("/", async (req, res) => {
  try {
    const { busName, route, busNumber, crew, time } = req.body;
    const newSchedule = new Schedule({ busName, route, busNumber, crew, time });
    await newSchedule.save();
    res.json(newSchedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add stops to a bus
router.post("/:busId/add-stops", async (req, res) => {
  try {
    const { stopIds } = req.body;
    const bus = await Schedule.findById(req.params.busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.stops = stopIds;
    await bus.save();

    await Stop.updateMany(
      { _id: { $in: stopIds } },
      { $addToSet: { buses: bus._id } }
    );

    res.json({ message: "Stops added to bus successfully!", bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get stops for a specific bus
router.get("/:busId/stops", async (req, res) => {
  try {
    const bus = await Schedule.findById(req.params.busId).populate("stops");
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.json(bus.stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
