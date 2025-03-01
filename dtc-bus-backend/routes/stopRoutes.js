const express = require("express");
const Stop = require("../models/Stop");

const router = express.Router();

// ✅ Get all stops
router.get("/", async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new stop
router.post("/", async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const newStop = new Stop({ name, latitude, longitude });
    await newStop.save();
    res.json(newStop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
