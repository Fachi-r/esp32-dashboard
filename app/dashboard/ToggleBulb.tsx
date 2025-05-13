"use client";

import { useState } from "react";
import { Button } from "@mui/joy";
import useWebSocket, { WEBSOCKET_URL } from "../hooks/useSensorData";

export default function ToggleBulb() {
  const { bulbStatus, healthStatus } = useWebSocket();
  const [loading, setLoading] = useState(false);
  const isOn = bulbStatus;

  const toggleBulb = async () => {
    // set a 5s timeout on HTTP call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setLoading(false);
    }, 10000);

    setLoading(true);
    const state = isOn ? "off" : "on";

    try {
      const res = await fetch(`${WEBSOCKET_URL}/bulb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Failed to toggle bulb");
    } catch (err) {
      console.error("Error toggling bulb:", err);
    } finally {
      setLoading(false);
    }
    clearTimeout(timeoutId);
  };

  const variant = isOn ? "solid" : "soft";

  return (
    <Button
      variant={variant}
      size="lg"
      loading={loading}
      disabled={healthStatus !== "online"}
      onClick={toggleBulb}
    >
      {healthStatus === "online"
        ? isOn
          ? "Turn Bulb Off"
          : "Turn Bulb On"
        : "ESP32 is offline"}
    </Button>
  );
}
