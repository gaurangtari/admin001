import React, { FC, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LuExpand } from "react-icons/lu";
import { BiCollapse } from "react-icons/bi";

import L from "leaflet";

// Fix default icon URLs (required for proper marker display)
import "leaflet/dist/leaflet.css";

interface MiniMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const rovIcon = new L.Icon({
  iconUrl: "images/bluerov_vector.png",
  iconSize: [40, 40], // adjust size to fit your design
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  shadowUrl: undefined,
  shadowSize: undefined,
  shadowAnchor: undefined,
});
const MiniMap: FC<MiniMapProps> = ({ latitude, longitude, zoom = 20 }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`relative rounded transition-all duration-300 overflow-hidden ${
        expanded ? "h-100 w-100" : "h-40 w-60"
      }`}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="absolute top-2 right-2 z-50 bg-white text-black px-2 py-1 text-xs rounded shadow hover:bg-gray-200"
      >
        {expanded ? <BiCollapse /> : <LuExpand />}
      </button>

      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={rovIcon}>
          <Popup>BlueROV</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MiniMap;
