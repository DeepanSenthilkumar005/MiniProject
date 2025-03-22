import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend } from '../App';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [busId, setBusId] = useState('');
    const [routeId, setRouteId] = useState('');
    const [departureTime, setDepartureTime] = useState('');

    useEffect(() => {
        const fetchSchedules = async () => {
            const response = await axios.get(`${backend}/api/schedules`);
            setSchedules(response.data);
        };

        const fetchBuses = async () => {
            const response = await axios.get(`${backend}/api/buses`);
            setBuses(response.data);
        };

        const fetchRoutes = async () => {
            const response = await axios.get(`${backend}/api/routes`);
            setRoutes(response.data);
        };

        fetchSchedules();
        fetchBuses();
        fetchRoutes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backend}/api/schedules`, { busId, routeId, departureTime });
            alert('Schedule added successfully!');
            const response = await axios.get(`${backend}/api/schedules`);
            setSchedules(response.data);
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Bus Schedules</h1>
            <form className="mb-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="bus" className="block text-sm font-medium text-gray-700">Bus:</label>
                    <select
                        id="bus"
                        value={busId}
                        onChange={(e) => setBusId(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    >
                        <option value="">Select Bus</option>
                        {buses.map(bus => (
                            <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="route" className="block text-sm font-medium text-gray-700">Route:</label>
                    <select
                        id="route"
                        value={routeId}
                        onChange={(e) => setRouteId(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    >
                        <option value="">Select Route</option>
                        {routes.map(route => (
                            <option key={route._id} value={route._id}>{route.startPoint} to {route.endPoint}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Departure Time:</label>
                    <input
                        type="datetime-local"
                        id="departureTime"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    Add Schedule
                </button>
            </form>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Schedules</h2>
            <ul className="space-y-4">
                {schedules.map(schedule => (
                    <li key={schedule._id} className="bg-gray-100 p-4 rounded-md shadow">
                        <div className="font-bold text-gray-800">
                            Bus: {schedule.busId.busNumber} - Route: {schedule.routeId.startPoint} to {schedule.routeId.endPoint} - Departure: {new Date(schedule.departureTime).toLocaleString()}
                        </div>
                        <ul className="mt-2">
                            {schedule.schedule.map((stop, index) => (
                                <li key={index} className="text-gray-600">{stop.stop}: {stop.time}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Schedule;