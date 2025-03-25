import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../App";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, busRes, routeRes] = await Promise.all([
          axios.get(`${backend}/api/schedules`),
          axios.get(`${backend}/api/buses`),
          axios.get(`${backend}/api/routes`),
        ]);

        setSchedules(scheduleRes.data);
        setBuses(busRes.data);
        setRoutes(routeRes.data);

        console.log("✅ Schedules:", scheduleRes.data);
        console.log("✅ Buses:", busRes.data);
        console.log("✅ Routes:", routeRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!busId || !routeId || !departureTime) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${backend}/api/schedules`, { busId, routeId, departureTime });
      alert("✅ Schedule added successfully!");

      // Fetch updated schedules
      const response = await axios.get(`${backend}/api/schedules`);
      setSchedules(response.data);
    } catch (error) {
      console.error("❌ Error adding schedule:", error);
      alert("❌ Failed to add schedule.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🚌 Bus Schedules</h1>

      {/* Add Schedule Form */}
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Route:</label>
          <select
            value={busId}
            onChange={(e) => setRouteId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">-- Routes --</option>
            {buses.length > 0 ? (
              buses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.name} (Route No: {bus.number})
                </option>
              ))
            ) : (
              <option disabled>No Routes found</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bus:</label>
          <select
            value={routeId}
            onChange={(e) => setBusId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="">-- Select Bus --</option>
            {routes.length > 0 ? (
              routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.start} → {route.destination}
                </option>
              ))
            ) : (
              <option disabled>No Buses found</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">
          ➕ Add Schedule
        </button>
      </form>

      {/* Display Current Schedules */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">📅 Current Schedules</h2>
      {schedules.length === 0 ? (
        <p className="text-gray-500">No schedules available.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule) => (
            <li key={schedule._id} className="bg-gray-100 p-4 rounded-md shadow">
              <div className="font-bold text-gray-800">
                🚌 {schedule.busId?.name || "Unknown Bus"} (Bus No: {schedule.busId?.number || "N/A"}) <br />
                📍 Route: {schedule.routeId?.start || "Unknown"} → {schedule.routeId?.destination || "Unknown"} <br />
                ⏰ Departure: {new Date(schedule.departureTime).toLocaleString()}
              </div>
              <ul className="mt-2 space-y-1">
                {schedule.schedule && schedule.schedule.length > 0 ? (
                  schedule.schedule.map((stop, index) => (
                    <li key={index} className="text-gray-600">
                      📍 {stop.stop}: {stop.time}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No stops added yet.</p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
