const express = require("express");
const BusList = require("../models/BusList");
const router = express.Router();

// ✅ GET: Fetch all bus routes
router.get("/", async (req, res) => {
  try {
    const busRoutes = await BusList.find({});
    res.json(busRoutes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus routes", error });
  }
});

// ✅ POST: Add a new bus route
router.post("/", async (req, res) => {
  try {
    const { routeNumber, details } = req.body;
    const newBusRoute = new BusList({ routeNumber, details });
    await newBusRoute.save();

    res.status(201).json({ message: "Bus Route Added", data: newBusRoute });
  } catch (error) {
    res.status(500).json({ message: "Error Adding Route", error: error.message });
  }
});

module.exports = router;
