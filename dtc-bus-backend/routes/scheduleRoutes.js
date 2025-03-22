const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const { calculateSchedule } = require('../utils/scheduler');

// Create a new schedule
router.post('/', async (req, res) => {
    const { busId, routeId, departureTime } = req.body;

    try {
        const bus = await Bus.findById(busId);
        const route = await Route.findById(routeId);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        if (!departureTime) {
            return res.status(400).json({ message: 'Departure time is required' });
        }

        const schedule = calculateSchedule(departureTime, route);

        const newSchedule = new Schedule({
            busId,
            routeId,
            departureTime,
            schedule,
        });

        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Get all schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('busId').populate('routeId');
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;