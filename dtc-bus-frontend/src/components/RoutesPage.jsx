import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend } from '../App';

const Route = () => {
    const [routes, setRoutes] = useState([]);
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [stops, setStops] = useState([{ name: '', travelTime: '' }]);

    useEffect(() => {
        const fetchRoutes = async () => {
            const response = await axios.get(`${backend}/api/routes`);
            setRoutes(response.data);
        };

        fetchRoutes();
    }, []);

    const handleStopChange = (index, e) => {
        const newStops = [...stops];
        newStops[index][e.target.name] = e.target.value;
        setStops(newStops);
    };

    const addStop = () => {
        setStops([...stops, { name: '', travelTime: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backend}/api/routes`, { startPoint, endPoint, stops });
            alert('Route added successfully!');
            // Refresh the route list
            const response = await axios.get(`${backend}/api/routes`);
            setRoutes(response.data);
            // Reset form
            setStartPoint('');
            setEndPoint('');
            setStops([{ name: '', travelTime: '' }]);
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    return (
        <div>
            <h1>Bus Routes</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Start Point:
                    <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} required />
                </label>
                <label>
                    End Point:
                    <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} required />
                </label>
                <h3>Stops</h3>
                {stops.map((stop, index) => (
                    <div key={index}>
                        <label>
                            Stop Name:
                            <input type="text" name="name" value={stop.name} onChange={(e) => handleStopChange(index, e)} required />
                        </label>
                        <label>
                            Travel Time (minutes):
                            <input type="number" name="travelTime" value={stop.travelTime} onChange={(e) => handleStopChange(index, e)} required />
                        </label>
                    </div>
                ))}
                <button type="button" onClick={addStop}>Add Stop</button>
                <button type="submit">Add Route</button>
            </form>
            <h2>Current Routes</h2>
            <ul>
                {routes.map(route => (
                    <li key={route._id}>
                        {route.startPoint} to {route.endPoint}
                        <ul>
                            {route.stops.map((stop, index) => (
                                <li key={index}>{stop.name} - {stop.travelTime} minutes</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Route;