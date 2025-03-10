const express = require("express");
const Route = require("../models/Route"); // Assuming Route model exists
const router = express.Router();


// Add New Route
router.post("/add-route", async (req, res) => {
    const { name, stops } = req.body;
  
    if (!name || !stops || !Array.isArray(stops)) {
      return res.status(400).json({ message: "Route name and valid stops are required" });
    }
  
    try {
      const newRoute = new Route({ name, stops });
      await newRoute.save();
      res.status(201).json({ message: "Route added successfully", route: newRoute });
    } catch (error) {
      res.status(500).json({ message: "Error adding route", error: error.message });
    }
  });

// Fetch all stops for start selection
router.get("/stops", async (req, res) => {
  try {
    const routes = await Route.find();
    const allStops = [...new Set(routes.flatMap(route => route.stops))];
    res.json(allStops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stops", error: error.message });
  }
});

// Fetch valid destination stops based on selected start
router.get("/destinations", async (req, res) => {
  const { start } = req.query;

  if (!start) {
    return res.status(400).json({ message: "Start location is required" });
  }

  try {
    const routes = await Route.find({ stops: { $in: [start] } });

    const validDestinations = [
      ...new Set(
        routes
          .map(route => {
            const startIndex = route.stops.indexOf(start);
            return route.stops.slice(startIndex + 1); // Only valid destinations after the selected start
          })
          .flat()
      ),
    ];

    if (validDestinations.length === 0) {
      return res.status(404).json({ message: "No valid destinations found for the selected start location." });
    }

    res.json(validDestinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destinations", error: error.message });
  }
});

module.exports = router;
