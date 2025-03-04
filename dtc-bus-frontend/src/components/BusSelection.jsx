import { useState, useEffect } from "react";
import axios from "axios";
import BusMap from "./BusMap"; // Import the map component

const BusSelection = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const backend = "https://miniproject-g9lj.onrender.com";
  // const backend = "http://localhost:8000";
  useEffect(() => {
    axios.get(`${backend}/api/buses`)
      .then(res => setBuses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Select a Bus</h1>
      <select onChange={(e) => setSelectedBusId(e.target.value)}>
        <option value="">-- Select a Bus --</option>
        {buses.map(bus => (
          <option key={bus._id} value={bus._id}>
            {bus.name} (Bus No: {bus.number})
          </option>
        ))}
      </select>

      {selectedBusId && <BusMap selectedBusId={selectedBusId} />}
    </div>
  );
};

export default BusSelection;
