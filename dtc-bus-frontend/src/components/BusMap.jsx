import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const BusMap = ({ selectedBusId }) => {
  const [bus, setBus] = useState(null);

  useEffect(() => {
    if (!selectedBusId) return;

    // Fetch bus data from API
    axios.get(`http://localhost:8000/api/buses/${selectedBusId}`)
      .then((res) => setBus(res.data))
      .catch((err) => console.error("Error fetching bus data:", err));
  }, [selectedBusId]);

  // Custom marker icon (optional)
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
  });

  return (
    <div className="h-96 w-full">
      <h2 className="text-lg font-bold mb-2">Bus Route Map</h2>
      
      <MapContainer center={[28.6129, 77.2295]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {bus?.stops.map((stop, index) => (
          <Marker key={index} position={[stop.latitude, stop.longitude]} icon={customIcon}>
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BusMap;
