import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import busStop from "../assets/BusMap/bus-stop1.png";
import busStand from "../assets/BusMap/bus-stand-1.png"; // Changed to local file for consistency
import { backend } from "../App";

const BusMap = ({ selectedBusId }) => {
  const [bus, setBus] = useState(null);
  const mapRef = useRef(null);


  useEffect(() => {
    if (!selectedBusId) return;

    axios
      .get(`${backend}/api/routes/${selectedBusId}`)
      .then((res) => {
        setBus(res.data);

        if (mapRef.current && res.data?.stops?.length > 0) {
          mapRef.current.setView(
            [
              res.data.stops[Math.floor(res.data.stops.length / 2)].latitude,
              res.data.stops[Math.floor(res.data.stops.length / 2)].longitude,
            ],
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
    <div className="h-96 -z-30 w-full">
      <h2 className="text-lg font-bold mb-2">Bus Route Map</h2>

      <MapContainer
        ref={mapRef}
        center={[
          bus.stops[Math.floor(bus.stops.length / 2)].latitude,
          bus.stops[Math.floor(bus.stops.length / 2)].longitude,
        ]}
        zoom={8}
        className="h-full z-0 w-full"
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

      {/* Show the Route After the Map */}

      {/* {bus.number.map((name, i) => (
        <p key={i}>{name}</p>
        ))} */}
      <h2 className="text-lg font-bold mb-2 mt-4">Bus Names</h2>
      <p className="ms-2 pb-6">{bus.number}</p>
    </div>
  );
};

export default BusMap;
