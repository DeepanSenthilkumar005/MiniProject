import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";
import Modal from "./Modal"; // Import the Modal component

const AddBusStopList = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [newBus, setNewBus] = useState({ name: "", number: "" });
  const [newStop, setNewStop] = useState({
    name: "",
    latitude: "",
    longitude: "",
    coordinates: "",
    timeDifference: "0", // Default value to prevent NaN issues
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [editingStop, setEditingStop] = useState(null); // State to control editing stop

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
    setIsModalOpen(true); // Open the modal when a bus is selected
  };

  // Handle stop input changes
  const handleStopInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "coordinates") {
      const [lat, lon] = value.split(",").map((num) => num.trim());
      setNewStop({
        ...newStop,
        latitude: lat || "",
        longitude: lon || "",
        coordinates: value,
      });
    } else {
      setNewStop({
        ...newStop,
        [name]:
          name === "timeDifference" ? Math.max(2, parseInt(value) || 0) : value, // Ensure min 2 minutes
      });
    }
  };

  // Handle adding a stop
  const handleAddStop = () => {
    if (!selectedBus) {
      alert("Please select a bus first.");
      return;
    }

    if (
      !newStop.name ||
      !newStop.latitude ||
      !newStop.longitude ||
      !newStop.timeDifference
    ) {
      alert(
        "Please enter Stop Name, Latitude, Longitude, and Time Difference."
      );
      return;
    }

    const stopData = {
      name: newStop.name,
      latitude: parseFloat(newStop.latitude),
      longitude: parseFloat(newStop.longitude),
      timeDifference: parseInt(newStop.timeDifference, 10) || 10, // Default to 10 minutes
    };

    axios
      .post(`${backend}/api/buses/${selectedBus._id}/add-stop`, stopData)
      .then((res) => {
        setBuses(
          buses.map((bus) => (bus._id === selectedBus._id ? res.data : bus))
        );
        setSelectedBus(res.data); // Update selected bus
        setNewStop({
          name: "",
          latitude: "",
          longitude: "",
          coordinates: "",
          timeDifference: "0",
        }); // Reset fields
        setIsModalOpen(false); // Close the modal after adding the stop
      })
      .catch((err) => {
        console.error("Error adding stop:", err);
        alert("Failed to add stop.");
      });
  };

  // Handle editing a stop
  const handleEditStop = (stop) => {
    setEditingStop(stop);
    setNewStop({
      name: stop.name,
      latitude: stop.latitude,
      longitude: stop.longitude,
      timeDifference: stop.timeDifference,
      coordinates: `${stop.latitude}, ${stop.longitude}`,
    });
  };

  // Handle updating a stop
  const handleUpdateStop = () => {
    if (!selectedBus || !editingStop) {
      alert("Please select a bus and a stop to edit.");
      return;
    }

    const updatedStopData = {
      name: newStop.name,
      latitude: parseFloat(newStop.latitude),
      longitude: parseFloat(newStop.longitude),
      timeDifference: parseInt(newStop.timeDifference, 10) || 10,
    };

    axios
      .put(
        `${backend}/api/buses/${selectedBus._id}/stops/${editingStop._id}`,
        updatedStopData
      )
      .then((res) => {
        setBuses(
          buses.map((bus) => (bus._id === selectedBus._id ? res.data : bus))
        );
        setSelectedBus(res.data); // Update selected bus
        setNewStop({
          name: "",
          latitude: "",
          longitude: "",
          coordinates: "",
          timeDifference: "0",
        }); // Reset fields
        setEditingStop(null); // Reset editing stop
      })
      .catch((err) => {
        console.error("Error updating stop:", err);
        alert("Failed to update stop.");
      });
  };

  // Handle deleting a stop
  const handleDeleteStop = (stopId) => {
    if (!selectedBus) {
      alert("Please select a bus first.");
      return;
    }
    if (window.confirm("Are you Sure want to Delete")) {
      axios
        .delete(`${backend}/api/buses/${selectedBus._id}/stops/${stopId}`)
        .then((res) => {
          setBuses(
            buses.map((bus) => (bus._id === selectedBus._id ? res.data : bus))
          );
          setSelectedBus(res.data); // Update selected bus
        })
        .catch((err) => {
          console.error("Error deleting stop:", err);
          alert("Failed to delete stop.");
        });
    }
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
                selectedBus && selectedBus._id === bus._id
                  ? "border-2 border-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectBus(bus)}
            >
              <h3 className="font-bold">{bus.name}</h3>
              <p className="text-sm text-gray-700">Stops: {bus.stops.length}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for adding stops */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-bold mb-2 -mx-5 text-center p-4 top-0 sticky bg-white">
          Manage Stops for {selectedBus?.name}
        </h2>
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
            type="text"
            name="coordinates"
            placeholder="Enter 'Latitude, Longitude'"
            value={newStop.coordinates}
            onChange={handleStopInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={newStop.latitude}
            className="w-full p-2 border rounded-md"
            disabled
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={newStop.longitude}
            className="w-full p-2 border rounded-md"
            disabled
          />
          <input
            type="number"
            name="timeDifference"
            placeholder="Time Difference (in minutes)"
            value={newStop.timeDifference}
            onChange={handleStopInputChange}
            className="w-full p-2 border rounded-md"
            min={2}
          />

          <button
            onClick={editingStop ? handleUpdateStop : handleAddStop}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {editingStop ? "Update Stop" : "Add Stop"}
          </button>
        </div>

        <h3 className="text-md font-bold mt-4">Current Stops</h3>
          <ul className="mt-2 space-y-2">
            {selectedBus?.stops.map((stop) => (
              <li
                key={stop._id}
                className="p-2 bg-gray-200 rounded-md flex justify-between items-center"
              >
                <span>
                  📍 {stop.name} ({stop.latitude}, {stop.longitude}) - ⏳{" "}
                  {stop.timeDifference} min
                </span>
                <div>
                  <button
                    onClick={() => handleEditStop(stop)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStop(stop._id)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Modal>
    </div>
  );
};

export default AddBusStopList;
