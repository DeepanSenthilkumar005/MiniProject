const backend = "https://miniproject-g9lj.onrender.com";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const BusMap = ({ selectedBusId }) => {
  const [bus, setBus] = useState(null);
  const mapRef = useRef(null); // Map reference for dynamic centering

  // const backend = "http://localhost:8000";

  useEffect(() => {
    if (!selectedBusId) return;

    axios
      .get(`${backend}/api/buses/${selectedBusId}`)
      .then((res) => {
        setBus(res.data);

        // Update the map center dynamically when a new bus is selected
        if (mapRef.current && res.data?.stops?.length > 0) {
          mapRef.current.setView(
            [res.data.stops[0].latitude, res.data.stops[0].longitude],
            12
          );
        }
      })
      .catch((err) => console.error("Error fetching bus data:", err));
  }, [selectedBusId]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  });

  if (!bus || !bus.stops || bus.stops.length === 0) {
    return <p className="text-red-500">No bus data available.</p>;
  }

  return (
    <div className="h-96 w-full">
      <h2 className="text-lg font-bold mb-2">Bus Route Map</h2>

      {/* Wrap MapContainer with a DynamicMap component for ref access */}
      <MapContainer
        ref={mapRef}
        center={[bus.stops[Math.floor(bus.stops.length / 2)].latitude, bus.stops[Math.floor(bus.stops.length / 2)].longitude]}
        zoom={5}
        className="h-full w-full -z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {bus.stops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.latitude, stop.longitude]}
            icon={customIcon}
          >
            <Popup>
              <strong>{stop.name}</strong> <br />
              🚏 {index === 0 ? "Starting Point" : index === bus.stops.length - 1 ? "Destination" : "Stop"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BusMap;
