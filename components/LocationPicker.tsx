import React, { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaTimes } from "react-icons/fa";
import { MapLayerMouseEvent } from "mapbox-gl";

interface LocationPickerProps {
  onSelectLocation: (location: { latitude: number; longitude: number } | null) => void;
  showMap: boolean;
  setShowMap: (value: boolean) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onSelectLocation,
  showMap,
  setShowMap,
  setLatitude,
  setLongitude,
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Please allow location access.");
        }
      );
    }
  }, []);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setSelectedLocation({ latitude, longitude });
  };
  
  const handleConfirmLocation = () => {
    onSelectLocation(selectedLocation);
    setIsMapVisible(false);

    if (selectedLocation) {
      setLatitude(selectedLocation.latitude);
      setLongitude(selectedLocation.longitude);
    } else if (currentLocation) {
      setLatitude(currentLocation.latitude);
      setLongitude(currentLocation.longitude);
    }

    setShowMap(false);
  };

  const toggleMap = () => setShowMap(!showMap);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="w-full min-h-screen bg-white">
      <div style={{ height: "74vh", width: "100%" }} className="p-4 pb-14 rounded-xl">
        {isMapVisible ? (
          currentLocation ? (
            <Map
              initialViewState={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                zoom: 12,
              }}
              style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker latitude={selectedLocation.latitude} longitude={selectedLocation.longitude} color="red" />
              )}
              <Marker latitude={currentLocation.latitude} longitude={currentLocation.longitude} color="blue" />

              <button onClick={toggleMap} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                <FaTimes size={24} />
              </button>
            </Map>
          ) : (
            <p>Loading map...</p>
          )
        ) : (
          <p>Location selected successfully!</p>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={handleConfirmLocation}
          className="bg-blue-500 text-white py-2 px-3 rounded"
          style={{
            position: "absolute",
            bottom: "10px", // Adjust bottom margin as needed
            left: "50%",
            transform: "translateX(-50%)", // Center horizontally
            zIndex: 10, // Ensure it's above the map
          }}
        >
          Confirm Location
        </button>
      </div>

      {selectedLocation && (
        <div
          style={{ position: "absolute", top: 70, right: 30 }}
          className="bg-yellow-400 rounded-sm font-bold text-[12px] text-white p-2"
        >
          <p>Selected Location:</p>
          <p>Latitude: {selectedLocation.latitude}</p>
          <p>Longitude: {selectedLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
