import { useState, useEffect } from "react";

const RoutesPage = () => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [allStops, setAllStops] = useState([]);
  const [filteredStops, setFilteredStops] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [error, setError] = useState("");

  // const backend = "http://localhost:8000";
  const backend = "https://miniproject-g9lj.onrender.com";


  // Fetch all stops when the page loads
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch(`${backend}/api/routes/stops`);
        const data = await response.json();
        setAllStops(data);
      } catch (err) {
        setError("Error fetching stops.");
      }
    };

    fetchStops();
  }, []);

  // Filter stops dynamically based on user input
  const handleStartChange = (text) => {
    setStart(text);
    if (!text) {
      setFilteredStops([]);
      setShowStartDropdown(false);
      return;
    }

    const filtered = allStops.filter((stop) =>
      stop.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredStops(filtered.length ? filtered : ["Place not found"]);
    setShowStartDropdown(true);
  };

  const handleDestinationChange = (text) => {
    setDestination(text);
    if (!text) {
      setFilteredDestinations([]);
      setShowDestinationDropdown(false);
      return;
    }

    const filtered = allStops.filter(
      (stop) =>
        stop.toLowerCase().includes(text.toLowerCase()) && stop !== start
    );

    setFilteredDestinations(filtered.length ? filtered : ["Place not found"]);
    setShowDestinationDropdown(true);
  };

  // Handle Start Selection
  const selectStart = (place) => {
    setStart(place);
    setFilteredStops([]);
    setShowStartDropdown(false);
  };

  // Handle Destination Selection
  const selectDestination = (place) => {
    if (place === start) {
      setError("Start and Destination cannot be the same place.");
      setDestination("");
      return;
    }
    setDestination(place);
    setFilteredDestinations([]);
    setShowDestinationDropdown(false);
    setError(""); // Clear any previous error
  };

  // Handle Search
  const handleSearch = async () => {
    if (!start || !destination) {
      setError("Please select both start and destination.");
      setRoutes([]);
      return;
    }

    try {
      const response = await fetch(
        `${backend}/api/routes/search?start=${start}&destination=${destination}`
      );

      const data = await response.json();
      console.log("Fetched Data:", data); // ✅ Add this for debugging

      if (!data || data.length === 0) {
        setError("No routes found.");
        setRoutes([]);
      } else {
        setRoutes(data);
        setError("");
      }
    } catch (err) {
      setError("Error fetching routes. Please try again.");
      setRoutes([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Find Your Bus Route
        </h2>

        <div className="flex flex-col space-y-4">
          {/* Start Location Input Field */}
          <input
            type="text"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="border rounded p-2"
            placeholder="Type Start Location"
          />
          {/* Display Recommended Stops */}
          {showStartDropdown && (
            <ul className="border rounded p-2 bg-white shadow-md">
              {filteredStops.map((stop, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => selectStart(stop)}
                >
                  <p className={`${filteredStops.includes("Place not found") ? "text-red-600" : ""}`}>
                    {stop}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* Destination Input Field */}
          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="border rounded p-2"
            placeholder="Type Destination"
          />
          {/* Display Recommended Destinations */}
          {showDestinationDropdown && (
            <ul className="border rounded p-2 bg-white shadow-md">
              {filteredDestinations.map((stop, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => selectDestination(stop)}
                >
                  <p className={`${filteredDestinations.includes("Place not found") ? "text-red-600" : ""}`}>
                    {stop}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white p-2 rounded font-semibold"
          >
            Find Route
          </button>
        </div>

        {/* Display Errors */}
        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Display Results */}
        <ul>

{/* Display Results */}
{routes.length > 0 && (
  <ul>
    {routes.map((route, index) => (
      <li key={index} className="mt-2">
        <strong>{route.name}</strong>
          {route.buses.map((bus, idx) => (
            <div key={idx} className="ml-4">
              🚍 Bus Number: {bus.busNumber} <br />
              🕒 Start Timing: {bus.timings} <br />
              🛑 Halt Duration at Stops:{" "}
              {route.haltTimes.map((halt, idx) => (
                <span key={idx}>{`${route.stops[idx]} - ${halt} mins`} <br /></span>
              ))}
              🔄 Shift: {bus.shift === "up" ? "Up" : "Down"} <br />
              🚌 Bus Type: {bus.busType}
              <hr />
            </div>
          ))}
        </li>
      ))}
    </ul>
  )}

        </ul>
      </div>
    </div>
  );
};

export default RoutesPage;
