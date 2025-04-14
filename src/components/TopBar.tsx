"use client";
import React, { FC, useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import nio_logo from "../../public/images/nio-logo-light.jpeg";
import jigyasa_logo from "../../public/images/jigyasa.png";

// Helper to format time as HH:MM
function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TopBar: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>(getFormattedTime());
  const [temperature, setTemperature] = useState<number | null>(null);

  // Update time exactly at minute boundary
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

  // Fetch weather based on user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
          const intervalId = setInterval(
            () => fetchWeather(latitude, longitude),
            20 * 60 * 1000 // refresh every 10 minutes
          );
          return () => clearInterval(intervalId);
        },
        (error) => console.error("Error getting location", error)
      );
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const data = await res.json();
      if (data?.main?.temp !== undefined) {
        setTemperature(data.main.temp);
      }
    } catch (err) {
      console.error("Error fetching weather", err);
    }
  };

  return (
    <div className="m-2 rounded-lg bg-zinc-800 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image src={nio_logo} alt="Logo" width={50} height={50} />
        <Image src={jigyasa_logo} alt="Logo" width={75} height={75} />
        <span className="text-xl font-bold"></span>
      </div>
      {/* Hamburger for mobile */}
      <button
        className="text-white lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      {/* Menu items */}
      <div
        className={`flex-col lg:flex-row lg:flex lg:items-center w-full lg:w-auto ${
          open ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center space-x-4 px-2 py-1">
          <div>
            {temperature !== null ? `${Math.round(temperature)}°C` : "...°C"}
          </div>
          <div>Ongoing</div>
          <div>{currentTime}</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
