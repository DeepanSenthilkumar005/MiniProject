import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function BusTracker() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [remainingSec, setRemainingSec] = useState(10);
  const updateInterval = 10 * 1000; // 10 seconds

  useEffect(() => {
    requestLocation(); // Fetch location on first load

    let startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeLeft = Math.max(10 - Math.floor(elapsed / 1000), 0);
      setRemainingSec(timeLeft);
    }, 1000);

    const interval = setInterval(() => {
      requestLocation();
      startTime = Date.now(); // Reset start time after updating location
    }, updateInterval);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAccuracy(position.coords.accuracy);
        setError(null);
        setRemainingSec(10); // Reset timer on update
      },
      (err) => {
        console.error("❌ Geolocation Error:", err);
        switch (err.code) {
          case 1:
            setError("❌ Permission denied. Please allow location access.");
            break;
          case 2:
            setError("❌ Location unavailable. Try again later or switch networks.");
            break;
          case 3:
            setError("⏳ Location request timed out. Please try again.");
            break;
          default:
            setError("❌ Unknown error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-bold">
        🚌 Live Bus Tracker {!error && `(Next update in ${remainingSec} sec)`}
      </h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : latitude && longitude ? (
        <>
          <p>
            <strong>📍 Latitude:</strong> {latitude} <br />
            <strong>📍 Longitude:</strong> {longitude} <br />
            <strong>🎯 Accuracy:</strong> ±{Math.round(accuracy)} meters
          </p>

          {/* Map Display */}
          <div className="mt-4 w-full h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User's Location Marker */}
              <Marker position={[latitude, longitude]}>
                <Popup>📍 You are here</Popup>
              </Marker>

              {/* Accuracy Circle */}
              {accuracy && (
                <Circle
                  center={[latitude, longitude]}
                  radius={accuracy}
                  pathOptions={{ fillColor: "blue", fillOpacity: 0.2, color: "blue" }}
                />
              )}
            </MapContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Fetching location...</p>
      )}
    </div>
  );
}

export default BusTracker;
