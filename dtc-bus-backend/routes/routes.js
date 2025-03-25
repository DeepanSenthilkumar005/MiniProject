const express = require("express");
const router = express.Router();
const Route = require("../models/Route"); // ✅ Make sure this Model exists

// ✅ Get all routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes", error });
  }
});

// ✅ Add a new route
router.post("/", async (req, res) => {
  try {
    const { start, destination, busName, busNumber, routeNumber } = req.body;
    const newRoute = new Route({ start, destination, busName, busNumber, routeNumber });
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ message: "Error adding route", error });
  }
});

module.exports = router;
