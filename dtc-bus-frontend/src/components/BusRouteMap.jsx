import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import axios from "axios";
import { backend } from "../App";

const BusRouteMap = () => {
  const { busId } = useParams(); // Get selected bus ID from URL
  const [stops, setStops] = useState([]);

  useEffect(() => {
    axios
      .get(`${backend}/api/buses/${busId}/stops`)
      .then((res) => setStops(res.data))
      .catch((err) => console.log(err));
  }, [busId]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Bus Route Map</h1>

      {stops.length > 0 ? (
        <MapContainer
          center={[stops[0].latitude, stops[0].longitude]}
          // center={[stops[Math.floor(stops.length)].latitude, stops[Math.floor(stops.length)].longitude]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Draw polyline route */}
          <Polyline
            positions={stops.map((stop) => [stop.latitude, stop.longitude])}
            color="blue"
          />

          {/* Add markers for each stop */}
          {stops.map((stop, index) => (
            <Marker key={index} position={[stop.latitude, stop.longitude]}>
              <Popup>{stop.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>No stops available for this bus.</p>
      )}
    </div>
  );
};

export default BusRouteMap;
