import { useState, useEffect } from "react";
import axios from "axios";
import { backend } from "../App";

function AddBus() {
  const [busName, setBusName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [message, setMessage] = useState("");
  const [buses, setBuses] = useState([]); // State to store bus list

  // ✅ Fetch buses from backend
  const fetchBuses = async () => {
    try {
      const response = await axios.get(`${backend}/api/buses`);
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // ✅ Load buses when the component mounts
  useEffect(() => {
    fetchBuses();
  }, []);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busName || !busNumber) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${backend}/api/buses`, {
        busName,
        busNumber,
      });

      if (response.status === 201) {
        setMessage("Bus added successfully!");
        setBusName("");
        setBusNumber("");
        fetchBuses(); // Refresh bus list
      }
    } catch (error) {
      setMessage("Error adding bus. Try again!");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Add a New Bus</h2>
      {message && <p className="text-red-500">{message}</p>}

      {/* ✅ Add Bus Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bus Name
          </label>
          <input
            type="text"
            value={busName}
            onChange={(e) => setBusName(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Enter Bus Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bus Number
          </label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Enter Bus Number"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Bus
        </button>
      </form>

      {/* ✅ Display Bus List */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Bus List</h2>
      <div className="w-96">
        {buses.length === 0 ? (
          <p className="text-gray-500">No buses available.</p>
        ) : (
          <ul className="border rounded p-4 shadow">
            {buses.map((bus, index) => (
              <li
                key={bus._id}
                className="border-b last:border-b-0 py-2 px-3 flex justify-between"
              >
                <span className="font-semibold">{bus.busName}</span>
                <span className="text-gray-700">{bus.busNumber}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddBus;
