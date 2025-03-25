import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../App";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]); // ✅ Fetch Crew Data
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [driverId, setDriverId] = useState(""); // ✅ Track selected Driver
  const [conductorId, setConductorId] = useState(""); // ✅ Track selected Conductor
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, busRes, routeRes, crewRes] = await Promise.all([
          axios.get(`${backend}/api/schedules`),
          axios.get(`${backend}/api/buses`),
          axios.get(`${backend}/api/routes`),
          axios.get(`${backend}/api/crew`), // ✅ Fetch Crew Members
        ]);

        setSchedules(scheduleRes.data || []);
        setBuses(busRes.data || []);
        setRoutes(routeRes.data || []);
        setCrewMembers(crewRes.data || []); // ✅ Store Crew Data

        console.log("✅ Schedules:", scheduleRes.data);
        console.log("✅ Buses:", busRes.data);
        console.log("✅ Routes:", routeRes.data);
        console.log("✅ Crew Members:", crewRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!busId || !routeId || !departureTime || !driverId || !conductorId) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${backend}/api/schedules`, {
        busId,
        routeId,
        departureTime,
        driverId,
        conductorId,
      });
      alert("✅ Schedule added successfully!");

      // Fetch updated schedules
      const response = await axios.get(`${backend}/api/schedules`);
      setSchedules(response.data || []);
    } catch (error) {
      console.error("❌ Error adding schedule:", error);
      alert("❌ Failed to add schedule.");
    }
  };

  const toggleSchedule = (scheduleId) => {
    setSelectedScheduleId((prevId) =>
      prevId === scheduleId ? null : scheduleId
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        🚌 Bus Schedules
      </h1>

      {/* Add Schedule Form */}
      {sessionStorage.getItem("role")==="Admin" && (
        <form className="mb-6" onSubmit={handleSubmit}>
          {/* Select Route */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Route:
            </label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">-- Select Route --</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.name} (Route No: {route.number})
                </option>
              ))}
            </select>
          </div>

          {/* Select Bus */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bus:
            </label>
            <select
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">-- Select Bus --</option>
              {buses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.busName} ({bus.busNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Select Driver */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Driver:
            </label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">-- Select Driver --</option>
              {crewMembers
                .filter((member) => member.role === "Driver")
                .map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Select Conductor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Conductor:
            </label>
            <select
              value={conductorId}
              onChange={(e) => setConductorId(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">-- Select Conductor --</option>
              {crewMembers
                .filter((member) => member.role === "Conductor")
                .map((conductor) => (
                  <option key={conductor._id} value={conductor._id}>
                    {conductor.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Departure Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Departure Time:
            </label>
            <input
              type="datetime-local"
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
            ➕ Add Schedule
          </button>
        </form>
      )}

      {/* Display Current Schedules */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        📅 Current Schedules
      </h2>
      {schedules.length === 0 ? (
        <p className="text-gray-500">No schedules available.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule) => (
            <li
              key={schedule._id}
              className="bg-gray-100 p-4 rounded-md shadow"
            >
              <div className="font-bold text-gray-800">
                🚌 {schedule.busId?.busName} (Bus No:{" "}
                {schedule.busId?.busNumber}) <br />
                📍 Route: {schedule.routeId?.name} <br />⏰ Departure:{" "}
                {new Date(schedule.departureTime).toLocaleString()} <br />
                👨‍✈️ Driver: {schedule.driverId?.name || "Not Assigned"} <br />
                🎟️ Conductor: {schedule.conductorId?.name || "Not Assigned"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
