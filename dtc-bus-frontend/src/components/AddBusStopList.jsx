import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";



const AddBusStopList = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [newBus, setNewBus] = useState({ name: "", number: "" });
  const [newStop, setNewStop] = useState({ name: "", latitude: "", longitude: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = () => {
    axios
      .get(`${backend}/api/buses`)
      .then((res) => {
        setBuses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching buses:", err);
        setError("Failed to load buses");
        setLoading(false);
      });
  };

  // Handle new bus input changes
  const handleBusInputChange = (e) => {
    setNewBus({ ...newBus, [e.target.name]: e.target.value });
  };

  // Handle adding a new bus
  const handleAddBus = () => {
    if (!newBus.name || !newBus.number) {
      alert("Please enter both Bus Name and Bus Number.");
      return;
    }

    axios
      .post(`${backend}/api/buses/`, newBus)
      .then((res) => {
        setBuses([...buses, res.data]); // Update UI instantly
        setNewBus({ name: "", number: "" }); // Reset input fields
      })
      .catch((err) => {
        console.error("Error adding bus:", err);
        alert("Failed to add bus.");
      });
  };

  // Handle selecting a bus
  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
  };

  // Handle stop input changes
  const handleStopInputChange = (e) => {
    setNewStop({ ...newStop, [e.target.name]: e.target.value });
  };

  // Handle adding a stop
  const handleAddStop = () => {
    if (!selectedBus) {
      alert("Please select a bus first.");
      return;
    }

    if (!newStop.name || !newStop.latitude || !newStop.longitude) {
      alert("Please enter Stop Name, Latitude, and Longitude.");
      return;
    }

    const stopData = {
      name: newStop.name,
      latitude: parseFloat(newStop.latitude),
      longitude: parseFloat(newStop.longitude),
    };

    axios
      .post(`${backend}/api/buses/${selectedBus._id}/add-stop`, stopData)
      .then((res) => {
        setBuses(buses.map(bus => (bus._id === selectedBus._id ? res.data : bus)));
        setSelectedBus(res.data); // Update UI instantly
        setNewStop({ name: "", latitude: "", longitude: "" }); // Reset fields
      })
      .catch((err) => {
        console.error("Error adding stop:", err);
        alert("Failed to add stop.");
      });
  };

  if (loading) return <p className="text-blue-500">Loading buses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Add New Bus</h2>
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Bus Name"
          value={newBus.name}
          onChange={handleBusInputChange}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          name="number"
          placeholder="Bus Number"
          value={newBus.number}
          onChange={handleBusInputChange}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleAddBus}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Bus
        </button>
      </div>

      <h2 className="text-lg font-bold mt-6">Available Buses</h2>
      {buses.length === 0 ? (
        <p className="text-gray-500">No buses available.</p>
      ) : (
        <ul className="space-y-3 mt-3">
          {buses.map((bus) => (
            <li
              key={bus._id}
              className={`p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 ${
                selectedBus && selectedBus._id === bus._id ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleSelectBus(bus)}
            >
              <h3 className="font-bold">{bus.name}</h3>
              <p className="text-sm text-gray-700">Stops: {bus.stops.length}</p>
            </li>
          ))}
        </ul>
      )}

      {selectedBus && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Add Stop to {selectedBus.name}</h2>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Stop Name"
              value={newStop.name}
              onChange={handleStopInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={newStop.latitude}
              onChange={handleStopInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={newStop.longitude}
              onChange={handleStopInputChange}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleAddStop}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Stop
            </button>
          </div>

          <h3 className="text-md font-bold mt-4">Current Stops</h3>
          <ul className="mt-2 space-y-2">
            {selectedBus.stops.map((stop, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded-md">
                📍 {stop.name} ({stop.latitude}, {stop.longitude})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddBusStopList;
