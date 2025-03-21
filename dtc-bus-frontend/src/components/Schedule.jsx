import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

const Schedule = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [busDetails, setBusDetails] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [departureTime, setDepartureTime] = useState(""); // User-selected departure time

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
        calculateSchedule(res.data, selectedDate, departureTime);
      })
      .catch(err => console.error("Error fetching bus details:", err));
  }, [selectedBusId, selectedDate, departureTime]);

  const calculateSchedule = (bus, date, time) => {
    if (!bus || bus.stops.length === 0 || !date || !time) return;

    let [hours, minutes] = time.split(":").map(Number);
    let startTime = new Date(date);
    startTime.setHours(hours, minutes, 0);

    let newSchedule = bus.stops.map((stop, index) => {
      let stopTime = new Date(startTime);

      if (index > 0) {
        let timeDiff = stop.timeDifference || 10; // Default 10 min if not set
        stopTime.setMinutes(startTime.getMinutes() + timeDiff);
      }

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

      <div className="w-full max-w-md space-y-3">
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

        <input 
          type="date" 
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <input 
          type="time" 
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
          value={departureTime} 
          onChange={(e) => setDepartureTime(e.target.value)}
        />
      </div>

      {busDetails && schedule.length > 0 && (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700">{busDetails.name} ({busDetails.number})</h2>
          <h3 className="text-md font-bold text-orange-500 mt-3">📅 Estimated Schedule:</h3>
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
