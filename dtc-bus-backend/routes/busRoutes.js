const express = require("express");
const Bus = require("../models/Bus");

const router = express.Router();

// Route to Search for Bus Routes
router.get("/search", async (req, res) => {
  const { start, destination } = req.query;

  if (!start || !destination) {
      return res.status(400).json({ message: "Start and destination are required." });
  }

  try {
      const routes = await Route.find({
          stops: { $all: [start, destination] } // Ensures both start and destination are in the route
      });

      // Filter routes where the destination appears after the start point
      const filteredRoutes = routes.filter(route => {
          const startIndex = route.stops.indexOf(start);
          const destinationIndex = route.stops.indexOf(destination);
          return startIndex !== -1 && destinationIndex !== -1 && startIndex < destinationIndex;
      });

      if (filteredRoutes.length === 0) {
          return res.status(404).json({ message: "No available routes found." });
      }

      res.json(filteredRoutes);
  } catch (error) {
      res.status(500).json({ message: "Error fetching routes", error: error.message });
  }
});


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
