import { useState, useEffect } from "react";
import axios from "axios";
import BusMap from "./BusMap";
import { backend } from "../App";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);

  useEffect(() => {
    axios
      .get(`${backend}/api/routes`)
      .then((res) => setBuses(res.data))
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Select a Bus</h1>

      <select
        onChange={(e) => setSelectedBusId(e.target.value)}
        className="border p-2 mt-3 w-full"
      >
        <option value="">-- Select a Bus --</option>
        {buses.map((bus) => (
          <option key={bus._id} value={bus._id}>
            {bus.name}
          </option>
        ))}
      </select>

      {/* Show the map only when a bus is selected */}
      {selectedBusId && <BusMap selectedBusId={selectedBusId} />}
    </div>
  );
};

export default Buses;
