const express = require("express");
const Bus = require("../models/location"); // Ensure correct model import
const router = express.Router();

// 🗑️ DELETE Bus Location (when driver exits)
router.delete("/delete/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params; // Ensure correct param name

    const bus = await Bus.findOne({ driverId });
    if (!bus) return res.status(404).json({ error: "Bus location not found" });

    await Bus.deleteOne({ driverId });

    res.status(200).json({ message: "Bus location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete location" });
  }
});

// 📍 UPDATE Driver Location (or create if not exists)
router.post("/update", async (req, res) => {
  const { driverId, latitude, longitude } = req.body;

  try {
    let bus = await Bus.findOneAndUpdate(
      { driverId }, // Search by driverId
      { latitude, longitude, lastUpdated: new Date() }, // Update fields
      { upsert: true, new: true } // Create if not exists
    );

    res.status(200).json({ message: "Location updated successfully", bus });
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

// 🌍 GET All Bus Locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await Bus.find(); // FIXED: Use correct model
    res.json(locations);
  } catch (error) {
    console.error("Error fetching bus locations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
