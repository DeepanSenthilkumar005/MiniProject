import { useState, useEffect } from "react";
import axios from "axios";
import {backend} from '../App'
const Crew = () => {
  const [buses, setBuses] = useState([]);
  useEffect(() => {
    axios.get(`${backend}/api/crew`) // Ensure the correct API route
      .then((res) => {
        setBuses(res.data);
        console.log("Fetched Crew Data:", res.data); // Debugging log
      })
      .catch((err) => console.error("Error fetching crew:", err));
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Bus Crew Members</h2>

      {buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((bus) => (
            <div key={bus._id} className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold">{bus.busName} ({bus.busNumber})</h3>
              <div className="mt-2">
                {bus.crew.map((member) => (
                  <div key={member._id} className="border p-2 rounded-lg bg-gray-100 mt-2">
                    <p><strong>Name:</strong> {member.name}</p>
                    <p><strong>Role:</strong> {member.role}</p>
                    <p><strong>Contact:</strong> {member.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500">No crew members found.</p>
      )}
    </div>
  );
};

export default Crew;
