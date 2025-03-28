import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { backend } from "../App";

function AdminBusTracker() {
  const [busLocations, setBusLocations] = useState([]);

  useEffect(() => {
    fetchBusLocations(); // Fetch when component loads
    const interval = setInterval(fetchBusLocations, 10000); // Refresh every 10 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchBusLocations = async () => {
    try {
      const res = await axios.get(`${backend}/api/location/locations`);
      setBusLocations(res.data);
      console.log("🛰️ Bus locations updated", res.data);
    } catch (err) {
      console.error("❌ Error fetching bus locations:", err);
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-bold">🗺️ Live Bus Locations (Admin View)</h2>

      {busLocations.length > 0 ? (
        <div className="mt-4 w-full h-[500px] rounded-lg overflow-hidden">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {busLocations.map((bus) => (
              <Marker key={bus.busId} position={[bus.latitude, bus.longitude]}>
                <Popup>
                  <strong>🚌 Bus ID:</strong> {bus.busId} <br />
                  <strong>📍 Location:</strong> {bus.latitude}, {bus.longitude}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <p className="text-gray-500">No active buses found.</p>
      )}
    </div>
  );
}

export default AdminBusTracker;
