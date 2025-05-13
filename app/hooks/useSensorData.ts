"use client";
import { useEffect, useState } from "react";

export const WEBSOCKET_URL = "https://mqtt-server-production.up.railway.app";

// Custom Hook for WebSocket
export default function useWebSocket() {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
  });
  const [bulbStatus, setBulbStatus] = useState(false);
  const [healthStatus, setHealthStatus] = useState("");
  let heartbeatTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

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
          // Reset timer on heartbeat
          clearTimeout(heartbeatTimeout);
          setHealthStatus("online");
          // If no heartbeat in 10 seconds, mark as offline
          heartbeatTimeout = setTimeout(() => {
            setHealthStatus("offline");
          }, 10000);
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
