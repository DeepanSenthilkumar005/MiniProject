import { useState, useEffect } from "react";
import { backend } from "../App";

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
  const [expandedRouteIndex, setExpandedRouteIndex] = useState(null);

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

  const selectStart = (place) => {
    setStart(place);
    setFilteredStops([]);
    setShowStartDropdown(false);
  };

  const selectDestination = (place) => {
    if (place === start) {
      setError("Start and Destination cannot be the same place.");
      setDestination("");
      return;
    }
    setDestination(place);
    setFilteredDestinations([]);
    setShowDestinationDropdown(false);
    setError("");
  };

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
      console.log("Fetched Data:", data);

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

  // Function to calculate arrival times for each stop
  const calculateTimings = (startTime, haltTime, stops) => {
    let timings = [];
    let [hours, minutes] = startTime.split(":").map(Number);

    for (let i = 0; i < stops.length; i++) {
      let timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} AM`;
      timings.push(timeString);
      minutes += haltTime;
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes %= 60;
      }
    }
    return timings;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Find Your Bus Route
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="border rounded p-2"
            placeholder="Type Start Location"
          />
          {showStartDropdown && (
            <ul className="border rounded p-2 bg-white shadow-md">
              {filteredStops.map((stop, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => selectStart(stop)}
                >
                  {stop}
                </li>
              ))}
            </ul>
          )}

          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="border rounded p-2"
            placeholder="Type Destination"
          />
          {showDestinationDropdown && (
            <ul className="border rounded p-2 bg-white shadow-md">
              {filteredDestinations.map((stop, index) => (
                <li
                  key={index}
                  className="p-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => selectDestination(stop)}
                >
                  {stop}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white p-2 rounded font-semibold"
          >
            Find Route
          </button>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <ul>
          {routes.length > 0 &&
            routes.map((route, index) => {
              let timings = calculateTimings("08:00", 2, route.stops);
              let startTime = timings[0];
              let endTime = timings[timings.length - 1];

              return (
                <li
                  key={index}
                  className="mt-4 border p-4 rounded bg-gray-50 shadow-md"
                >
                  <strong className="text-lg">{route.name}</strong>
                  {console.log(route)}
                  {route.buses.map((bus, idx) => (
                    <div key={idx} className="ml-4">
                      🚍 Bus Number: {bus.busNumber} <br />
                      🕒 **Start Time**: {startTime} <br />
                      🕒 **Destination Time**: {endTime} <br />
                      🔄 Shift: {bus.shift === "up" ? "Up" : "Down"} <br />
                      🚌 Bus Type: {bus.busType} <br />
                      {/* Show More Button */}
                      <button
                        onClick={() =>
                          setExpandedRouteIndex(
                            index === expandedRouteIndex ? null : index
                          )
                        }
                        className="mt-2 bg-blue-500 text-white p-1 rounded text-sm"
                      >
                        {expandedRouteIndex === index
                          ? "Show Less"
                          : "Show More"}
                      </button>
                      {/* Show all stops only if expanded */}
                      {expandedRouteIndex === index && (
                        <div className="mt-2">
                          <strong>All Stops & Timings:</strong>
                          <ul className="pl-4 mt-1">
                            {route.stops.map((stop, idx) => (
                              <li key={idx}>
                                🛑 {stop} - {timings[idx]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <hr />
                    </div>
                  ))}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default RoutesPage;
