const express = require("express");
const Bus = require("../models/Bus");

const router = express.Router();

// ✅ Route to Search for Bus Routes
router.get("/search", async (req, res) => {
  const { start, destination } = req.query;

  if (!start || !destination) {
    return res.status(400).json({ message: "Start and destination are required." });
  }

  try {
    // Find all buses that include both start and destination stops
    const buses = await Bus.find({
      "stops.name": { $all: [start, destination] }
    });

    // Filter to ensure destination appears after start
    const filteredBuses = buses.filter(bus => {
      const startIndex = bus.stops.findIndex(stop => stop.name === start);
      const destinationIndex = bus.stops.findIndex(stop => stop.name === destination);
      return startIndex !== -1 && destinationIndex !== -1 && startIndex < destinationIndex;
    });

    if (filteredBuses.length === 0) {
      return res.status(404).json({ message: "No available routes found." });
    }

    res.json(filteredBuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes", error: error.message });
  }
});

// ✅ POST: Add a new bus
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

// ✅ POST: Add a stop to a specific bus
router.post("/:id/add-stop", async (req, res) => {
  try {
    const { name, latitude, longitude, timeDifference } = req.body;
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    bus.stops.push({ name, latitude, longitude, timeDifference: timeDifference || 10 }); // Default to 10 mins
    await bus.save();
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: "Error adding stop", error: error.message });
  }
});

module.exports = router;
