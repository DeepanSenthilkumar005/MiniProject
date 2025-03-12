import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import busStop from "../assets/BusMap/bus-stop.png";
import busStand from "../assets/BusMap/bus-stand.png"; // Changed to local file for consistency

const BusMap = ({ selectedBusId }) => {
  const [bus, setBus] = useState(null);
  const mapRef = useRef(null);

  const backend = "https://miniproject-g9lj.onrender.com";
  // const backend = "http://localhost:8000";

  useEffect(() => {
    if (!selectedBusId) return;

    axios
      .get(`${backend}/api/buses/${selectedBusId}`)
      .then((res) => {
        setBus(res.data);

        if (mapRef.current && res.data?.stops?.length > 0) {
          mapRef.current.setView(
            [res.data.stops[Math.floor(res.data.stops.length / 2)].latitude, res.data.stops[Math.floor(res.data.stops.length / 2)].longitude],
            12
          );
        }
      })
      .catch((err) => console.error("Error fetching bus data:", err));
  }, [selectedBusId]);

  // Dynamic icon logic
  const getCustomIcon = (index) => {
    return new L.Icon({
      iconUrl:
        index === 0 || index === bus.stops.length - 1 ? busStand : busStop,
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });
  };

  if (!bus || !bus.stops || bus.stops.length === 0) {
    return <p className="text-red-500">No bus data available.</p>;
  }

  return (
    <div className="h-96 w-full">
      <h2 className="text-lg font-bold mb-2">Bus Route Map</h2>

      <MapContainer
        ref={mapRef}
        center={[
          bus.stops[Math.floor(bus.stops.length / 2)].latitude,
          bus.stops[Math.floor(bus.stops.length / 2)].longitude,
        ]}
        zoom={10}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {bus.stops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.latitude, stop.longitude]}
            icon={getCustomIcon(index)}
          >
            <Popup>
              <strong>{stop.name}</strong> <br />
              🚏{" "}
              {index === 0
                ? "Starting Point"
                : index === bus.stops.length - 1
                ? "Destination"
                : "Stop"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BusMap;
