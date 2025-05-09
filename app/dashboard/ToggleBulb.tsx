"use client";

import { useState } from "react";
import { Button } from "@mui/joy";
import useWebSocket from "../hooks/useSensorData";

export default function ToggleBulb() {
  const { bulbStatus, healthStatus } = useWebSocket();
  const isOn = bulbStatus;
  
  const [loading, setLoading] = useState(false);

  const toggleBulb = async () => {
    // set up a 5s timeout on our HTTP call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setLoading(false);
    }, 10000);

    setLoading(true);
    const state = isOn ? "off" : "on";

    try {
      const res = await fetch("http://localhost:4001/bulb", {
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
      disabled={healthStatus !== "alive"}
      onClick={toggleBulb}
    >
      {healthStatus === "alive"
        ? isOn
          ? "Turn Bulb Off"
          : "Turn Bulb On"
        : "ESP32 is offline"}
    </Button>
  );
}
