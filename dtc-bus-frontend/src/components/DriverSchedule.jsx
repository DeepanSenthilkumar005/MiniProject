import axios from "axios";
import React, { useEffect, useState } from "react";
import { backend } from "../App";

function DriverSchedule() {
  const [schedules, setSchedules] = useState([]);
  const driverId = sessionStorage.getItem("userId"); // Get driver ID from sessionStorage

  useEffect(() => {
    if (!driverId) {
      console.warn("⚠️ No userId found in sessionStorage!");
      return; // Stop execution if no userId
    }

    axios
      .get(`${backend}/api/schedules/`)
      .then((res) => {
        console.log("Fetched schedules:", res.data);

        // Ensure res.data is an array
        const driverSchedules = res.data.filter((schedule) => {
          console.log(schedule.driverId?._id+"==="+driverId);
          return (schedule.driverId?.mail) == driverId;
          // return (schedule.driverId?._id).toString() === driverId.toString();

        });
        console.log("dd",driverSchedules);
        
        setSchedules(driverSchedules);
      })
      .catch((e) => console.log("❌ Error fetching schedules:", e));
  }, [driverId]); // ✅ Only runs when driverId is set

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🚍 Your Schedule</h1>

      {!driverId ? (
        <p className="text-red-500">⚠️ You are not logged in. Please log in first.</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-500">No schedules assigned.</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule) => (
            <li key={schedule._id} className="bg-gray-100 p-4 rounded-md shadow">
              <div className="font-bold text-gray-800">
                🚌 {schedule.busId?.busName} (Bus No: {schedule.busId?.busNumber}) <br />
                📍 Route: {schedule.routeId?.name} <br />
                ⏰ Departure: {new Date(schedule.departureTime).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DriverSchedule;
