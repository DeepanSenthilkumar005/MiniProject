const express = require("express");
const Route = require("../models/Route");

const router = express.Router();

// ✅ Search for Routes
router.get("/search", async (req, res) => {
  const { start, destination } = req.query;

  if (!start || !destination) {
    return res.status(400).json({ message: "Start and destination are required." });
  }

  try {
    // Find all routes that include both start and destination stops
    const routes = await Route.find({
      "stops.name": { $all: [start, destination] }
    });

    // Filter to ensure destination appears after start
    const filteredRoutes = routes.filter(route => {
      const startIndex = route.stops.findIndex(stop => stop.name === start);
      const destinationIndex = route.stops.findIndex(stop => stop.name === destination);
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

// ✅ Add a New Route
router.post("/", async (req, res) => {
  try {
    const { name, number, stops } = req.body;
    const newRoute = new Route({ name, number, stops });

    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch All Routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find(); // Fetch all routes
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Fetch a Single Route by ID
router.get("/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add a Stop to a Specific Route
router.post("/:id/add-stop", async (req, res) => {
  try {
    const { name, latitude, longitude, timeDifference } = req.body;
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    route.stops.push({ name, latitude, longitude, timeDifference: timeDifference || 10 }); // Default to 10 mins
    await route.save();
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Error adding stop", error: error.message });
  }
});

// ✅ Update a Stop in a Specific Route
router.put("/:routeId/stops/:stopId", async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const stopId = req.params.stopId;
    const stopData = req.body;
    
    const route = await Route.findOneAndUpdate(
      { _id: routeId, "stops._id": stopId },
      { $set: { "stops.$": stopData } },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route or Stop not found" });
    }

    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update route stop" });
  }
});

// ✅ Delete a Stop from a Specific Route
router.delete("/:routeId/stops/:stopId", async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const stopId = req.params.stopId;

    const route = await Route.findByIdAndUpdate(
      routeId,
      { $pull: { stops: { _id: stopId } } },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ message: "Route or Stop not found" });
    }

    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete route stop" });
  }
});

module.exports = router;
