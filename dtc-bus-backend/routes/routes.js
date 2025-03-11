const express = require("express");
const Route = require("../models/Route");
const router = express.Router();

// ✅ Add New Route with Halt Time
router.post("/add-route", async (req, res) => {
    const { name, stops, buses, timings, haltTimes } = req.body;

    if (!name || !stops || !Array.isArray(stops) || !Array.isArray(buses) || !Array.isArray(timings) || !Array.isArray(haltTimes)) {
        return res.status(400).json({ message: "All fields including halt times are required." });
    }

    if (stops.length !== timings.length || stops.length !== haltTimes.length) {
        return res.status(400).json({ message: "Each stop must have a corresponding timing and halt value." });
    }

    try {
        const newRoute = new Route({ name, stops, buses, timings, haltTimes });
        await newRoute.save();
        res.status(201).json({ message: "Route added successfully", route: newRoute });
    } catch (error) {
        res.status(500).json({ message: "Error adding route", error: error.message });
    }
});

// ✅ Search Route by Start and Destination with Timing Calculation
router.get("/search", async (req, res) => {
    const { start, destination } = req.query;

    if (!start || !destination) {
        return res.status(400).json({ message: "Start and destination are required." });
    }

    try {
        const routes = await Route.find({
            stops: { $all: [start, destination] }
        });

        const validRoutes = routes.map((route) => {
            const startIndex = route.stops.indexOf(start);
            const destinationIndex = route.stops.indexOf(destination);

            if (startIndex === -1 || destinationIndex === -1) return null;

            const shiftType = startIndex < destinationIndex ? "Up" : "Down";

            // Timing Calculation with Halt Time
            const totalTime = route.timings
                .slice(Math.min(startIndex, destinationIndex), Math.max(startIndex, destinationIndex))
                .reduce((sum, time) => sum + time, 0);

            const haltTime = route.haltTimes
                .slice(Math.min(startIndex, destinationIndex), Math.max(startIndex, destinationIndex))
                .reduce((sum, halt) => sum + halt, 0);

            const totalDuration = totalTime + haltTime;

            const updatedBuses = route.buses.map((bus) => ({
                ...bus,
                shift: shiftType,
                estimatedTime: totalDuration
            }));

            return {
                ...route._doc,
                buses: updatedBuses
            };
        }).filter(route => route !== null);

        if (validRoutes.length === 0) {
            return res.status(404).json({ message: "No valid routes found." });
        }

        res.json(validRoutes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching routes", error: error.message });
    }
});

// ✅ Fetch all stops for start selection
router.get("/stops", async (req, res) => {
    try {
        const routes = await Route.find({});
        const allStops = [...new Set(routes.flatMap(route => route.stops))];
        res.json(allStops);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stops", error: error.message });
    }
});

// ✅ Fetch valid destination stops based on selected start
router.get("/destinations", async (req, res) => {
    const { start } = req.query;

    if (!start) {
        return res.status(400).json({ message: "Start location is required." });
    }

    try {
        const routes = await Route.find({ stops: { $in: [start] } });

        const validDestinations = [
            ...new Set(
                routes.map(route => {
                    const startIndex = route.stops.indexOf(start);
                    return route.stops.slice(startIndex + 1); 
                }).flat()
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
