import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

const Schedule = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [busDetails, setBusDetails] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios.get(`${backend}/api/buses`)
      .then(res => setBuses(res.data))
      .catch(err => console.error("Error fetching buses:", err));
  }, []);

  useEffect(() => {
    if (!selectedBusId) return;

    axios.get(`${backend}/api/buses/${selectedBusId}`)
      .then(res => {
        setBusDetails(res.data);
        calculateSchedule(res.data);
      })
      .catch(err => console.error("Error fetching bus details:", err));
  }, [selectedBusId]);

  const calculateSchedule = (bus) => {
    if (!bus || bus.stops.length === 0) return;

    const startTime = new Date();
    let hr = Math.floor(1+Math.random()*12);
    startTime.setHours(hr, 0, 0); // Start time at 8:00 AM

    let newSchedule = bus.stops.map((stop, index) => {
      let stopTime = new Date(startTime);
      stopTime.setMinutes(startTime.getMinutes() + index * (bus.interval || 15)); // Add interval

      return {
        stopName: stop.name,
        time: stopTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      };
    });

    setSchedule(newSchedule);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-800">🚍 Bus Schedule</h1>

      {/* Dropdown */}
      <div className="w-full max-w-md">
        <select 
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
          onChange={(e) => setSelectedBusId(e.target.value)}
        >
          <option value="">-- Select a Bus --</option>
          {buses.map(bus => (
            <option key={bus._id} value={bus._id}>
              {bus.name} (Bus No: {bus.number})
            </option>
          ))}
        </select>
      </div>

      {busDetails && (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700">{busDetails.name} ({busDetails.number})</h2>
          <h3 className="text-md font-bold text-orange-500 mt-3">📅 Schedule:</h3>
          <ul className="mt-3 space-y-3">
            {schedule.map((stop, index) => (
              <li key={index} className="p-3 flex justify-between bg-gray-50 border-l-4 border-orange-500 rounded-lg shadow-sm hover:bg-gray-100 transition-all">
                <span className="font-medium text-gray-700">🚌 {stop.stopName}</span>
                <span className="font-semibold text-gray-900">{stop.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Schedule;
