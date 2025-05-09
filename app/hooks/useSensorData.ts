"use client";
import { useEffect, useState } from "react";

// Custom Hook for WebSocket
export default function useWebSocket() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
  });
  const [bulbStatus, setBulbStatus] = useState(false);
  const [healthStatus, setHealthStatus] = useState("");

  useEffect(() => {
    const socket = new WebSocket("http://localhost:4000"); // Use your server URL

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "sensor-data":
          setSensorData({
            temperature: data.temperature,
            humidity: data.humidity,
          });
          break;
        case "bulb-status":
          const isOn = data.isOn == "on" ? true : false;
          setBulbStatus(isOn);
          break;
        case "esp32-health":
          setHealthStatus(data.status);
          break;
        default:
          console.log("Unknown message type:", data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup the socket connection on unmount
    return () => {
      socket.close();
    };
  }, []);

  return { sensorData, bulbStatus, healthStatus };
}
