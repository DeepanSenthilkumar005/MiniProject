import { useState, useEffect } from "react";
import axios from "axios";
import BusMap from "./BusMap";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const backend = "https://miniproject-g9lj.onrender.com";
  // const backend = "http://localhost:8000";
  useEffect(() => {
    axios.get(`${backend}/api/schedules`)
      .then(res => setSchedules(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleBusSelect = async (bus) => {
    setSelectedBus(bus);
    try {
      const res = await axios.get(`${backend}/api/schedules/${bus._id}/stops`);
      setBusStops(res.data);
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Bus Schedules</h1>

      <ul>
        {schedules.map(bus => (
          <li key={bus._id} className="border p-2 mt-2 cursor-pointer" onClick={() => handleBusSelect(bus)}>
            {bus.busName} - {bus.route}
          </li>
        ))}
      </ul>

      {selectedBus && <BusMap busStops={busStops} />}
    </div>
  );
};

export default Schedule;
