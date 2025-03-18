const express = require("express");
const router = express.Router();
const Bus = require("../models/Schedule");

// Get all buses with their schedule
router.get("/schedule", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bus schedules" });
  }
});

module.exports = router;
