import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

function Schedule() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusSchedules();
  }, []);

  const fetchBusSchedules = async () => {
    try {
      const res = await axios.get(`${backend}/api/buses/schedule`);
      setBuses(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load bus schedules");
      setLoading(false);
    }
  };

  // Function to add minutes to a time string
  const addMinutes = (time, minutes) => {
    let [hours, mins, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    hours = parseInt(hours, 10);
    mins = parseInt(mins, 10);
    minutes = parseInt(minutes, 10);

    mins += minutes;
    while (mins >= 60) {
      mins -= 60;
      hours += 1;
    }

    if (hours > 12) {
      hours -= 12;
      period = period === "AM" ? "PM" : "AM";
    }

    return `${hours}:${mins.toString().padStart(2, "0")} ${period}`;
  };

  if (loading) return <p className="text-blue-500">Loading schedules...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bus Schedule</h2>

      {buses.length === 0 ? (
        <p className="text-gray-500">No buses available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Bus Name</th>
                <th className="border p-2">Stop</th>
                <th className="border p-2">Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) =>
                bus.stops.map((stop, index) => {
                  const arrivalTime = index === 0 
                    ? bus.startTime // First stop starts at base time
                    : addMinutes(bus.startTime, stop.interval);

                  return (
                    <tr key={`${bus.number}-${index}`} className="text-center">
                      {index === 0 && (
                        <td rowSpan={bus.stops.length} className="border p-2 font-bold">
                          {bus.name}
                        </td>
                      )}
                      <td className="border p-2">{stop.name}</td>
                      <td className="border p-2">{arrivalTime}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Schedule;
