"use client";
import React, { FC, useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

// Helper to format time as HH:MM
function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TopBar: FC = () => {
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>("…");

  // Update time exactly on the minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getFormattedTime());
      const now = new Date();
      const msToNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      setTimeout(updateTime, msToNextMinute);
    };
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeoutId = setTimeout(updateTime, msToNextMinute);
    return () => clearTimeout(timeoutId);
  }, []);

  // Reverse geocode helper (BigDataCloud as before)
  async function fetchLocationName(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await res.json();
      const name =
        data.locality || data.principalSubdivision || data.city || "Unknown";
      setLocationName(name);
    } catch (err) {
      console.error("Error reverse-geocoding location", err);
      setLocationName("Unknown");
    }
  }

  // Fetch weather via Open‑Meteo
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await res.json();
      if (data.current_weather?.temperature !== undefined) {
        setTemperature(data.current_weather.temperature);
      }
    } catch (err) {
      console.error("Error fetching weather from Open‑Meteo", err);
    }
  };

  // On mount: get coords, fetch weather + location, and set up refresh
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
        fetchLocationName(latitude, longitude);

        const intervalId = setInterval(() => {
          fetchWeather(latitude, longitude);
          fetchLocationName(latitude, longitude);
        }, 20 * 60 * 1000);

        return () => clearInterval(intervalId);
      },
      (error) => console.error("Error getting location", error)
    );
  }, []);

  return (
    <div className="relative m-2 h-10 rounded-lg bg-zinc-800 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image
          src="/images/nio-logo-light.png"
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="font-semibold">CSIR-NIO</span>
      </div>

      {/* Mobile hamburger */}
      <button
        className="text-white lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Desktop items */}
      <div className="hidden lg:flex lg:items-center space-x-6 text-white">
        <div>
          {temperature !== null ? `${Math.round(temperature)}°C` : "...°C"}
        </div>
        <div>{locationName}</div>
        <div>{currentTime}</div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 shadow-lg rounded-b-lg mt-1 overflow-hidden">
          <div className="flex flex-col p-4 space-y-2 text-white">
            <div className="flex justify-between">
              <span>Temp:</span>
              <span>
                {temperature !== null
                  ? `${Math.round(temperature)}°C`
                  : "...°C"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{locationName}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
