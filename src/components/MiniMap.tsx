"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FiTarget } from "react-icons/fi";
import { LuExpand } from "react-icons/lu";
import { BiCollapse, BiTargetLock } from "react-icons/bi";

import "leaflet/dist/leaflet.css";

const rovIcon = new L.Icon({
  iconUrl: "images/bluerov_vector.png",
  iconSize: [40, 40], // adjust size to fit your design
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
  shadowUrl: undefined,
  shadowSize: undefined,
  shadowAnchor: undefined,
});

interface MiniMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const RecenterControl: FC<{ lat: number; lng: number; trigger: boolean }> = ({
  lat,
  lng,
  trigger,
}) => {
  const map = useMap();

  useEffect(() => {
    if (trigger) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [trigger, lat, lng, map]);

  return null;
};

const MiniMap: FC<MiniMapProps> = ({ latitude, longitude, zoom = 20 }) => {
  const [expanded, setExpanded] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(false);

  const handleRecenter = () => {
    setRecenterTrigger(false);
    requestAnimationFrame(() => setRecenterTrigger(true));
  };

  useEffect(() => {
    if (!expanded) {
      handleRecenter();
    }
  }, [expanded]);

  return (
    <div
      className={`
        relative rounded overflow-hidden transition-all duration-300
        ${expanded ? "h-100 w-100" : "h-40 w-60"} 
      `}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-50 flex space-x-1">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-gray-700 text-white p-1 rounded hover:bg-gray-300 hover:text-gray-700"
          title={expanded ? "Collapse map" : "Expand map"}
        >
          {expanded ? <BiCollapse size={16} /> : <LuExpand size={16} />}
        </button>
        <button
          onClick={handleRecenter}
          className="bg-gray-700 text-white p-1 rounded hover:bg-gray-300 hover:text-gray-700"
          title="Center on ROV"
        >
          <BiTargetLock size={19} />
        </button>
      </div>

      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className={`
          z-0
          h-full w-full
        `}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={rovIcon}>
          <Popup>BlueROV</Popup>
        </Marker>
        <RecenterControl
          lat={latitude}
          lng={longitude}
          trigger={recenterTrigger}
        />
      </MapContainer>
    </div>
  );
};

export default MiniMap;
