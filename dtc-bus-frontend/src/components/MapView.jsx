import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Route Map</h2>
      <MapContainer center={[11.35769, 77.82543]} zoom={12} className="h-64 w-md">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default MapView;
