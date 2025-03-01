const express = require("express");
const Bus = require("../models/Bus");

const router = express.Router();

// POST: Add a new bus
router.post("/", async (req, res) => {
  try {
    const { name, number, stops } = req.body;
    const newBus = new Bus({ name, number, stops });

    await newBus.save();
    res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET: Fetch all buses
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find(); // Fetch all buses
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET: Fetch a single bus by ID
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
