const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus"); // ✅ Ensure this Model exists

// ✅ Get all buses
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buses", error });
  }
});

// ✅ Add a new bus
router.post("/", async (req, res) => {
  try {
    const { busName, busNumber } = req.body;
    const newBus = new Bus({ busName, busNumber });
    await newBus.save();
    res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ message: "Error adding bus", error });
  }
});

module.exports = router;
