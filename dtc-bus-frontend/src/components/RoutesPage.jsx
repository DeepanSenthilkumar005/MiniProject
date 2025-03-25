import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../App";

const RoutePage = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routeNumber, setRouteNumber] = useState("");
  const [busId, setBusId] = useState("");
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${backend}/api/buses`);
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${backend}/api/routes`);
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const handleBusSelection = (e) => {
    const selectedBus = buses.find((bus) => bus._id === e.target.value);
    setBusId(selectedBus?._id || "");
    setBusName(selectedBus?.name || "");
    setBusNumber(selectedBus?.number || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!routeNumber || !busId) {
      alert("Please enter a Route Number and select a Bus.");
      return;
    }

    try {
      await axios.post(`${backend}/api/buses`, {
        routeNumber,
        busId,
        busName,
        busNumber,
      });

      alert("✅ Route added successfully!");
      fetchRoutes(); // Refresh the route list
      setRouteNumber("");
      setBusId("");
      setBusName("");
      setBusNumber("");
    } catch (error) {
      console.error("Error adding route:", error);
      alert("❌ Failed to add route.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🛣️ Manage Routes</h1>

      {/* Form to Add Route */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Route Number:</label>
          <input
            type="text"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Bus:</label>
          <select
            value={busId}
            onChange={handleBusSelection}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Bus --</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.name} (Bus No: {bus.number})
              </option>
            ))}
          </select>
        </div>

        {/* Auto-filled Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bus Name:</label>
          <input
            type="text"
            value={busName}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bus Number:</label>
          <input
            type="text"
            value={busNumber}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-200"
        >
          ➕ Add Route
        </button>
      </form>

      {/* Display Existing Routes */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">📍 Existing Routes</h2>
      {routes.length === 0 ? (
        <p className="text-gray-500">No routes available.</p>
      ) : (
        <ul className="space-y-4">
          {routes.map((route) => (
            <li key={route._id} className="bg-gray-100 p-4 rounded-md shadow">
              <p className="font-bold text-gray-800">
                🛣️ Route No: {route.routeNumber}
              </p>
              <p className="text-gray-700">
                🚌 {route.busName} (Bus No: {route.busNumber})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoutePage;
