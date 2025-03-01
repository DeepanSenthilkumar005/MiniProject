const express = require("express");
const Crew = require("../models/Crew");

const router = express.Router();

// Add a new crew member
router.post("/", async (req, res) => {
  try {
    const newCrew = new Crew(req.body);
    await newCrew.save();
    res.status(201).json(newCrew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all crew members
router.get("/", async (req, res) => {
  try {
    const crew = await Crew.find();
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get crew details by bus number
router.get("/:busNumber", async (req, res) => {
  try {
    const crew = await Crew.findOne({ busNumber: req.params.busNumber });
    if (!crew) {
      return res.status(404).json({ message: "Crew not found" });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
