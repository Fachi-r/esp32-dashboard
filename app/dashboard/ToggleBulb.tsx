"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";
import { Button } from "@mui/joy";

export default function ToggleBulb() {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleBulb = async () => {
    setLoading(true);
    const command = isOn ? "off" : "on";

    try {
      const res = await fetch("/api/bulb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!res.ok) throw new Error("Failed to toggle bulb");

      setIsOn(!isOn);
    } catch (err) {
      console.error("Error toggling bulb:", err);
    } finally {
      setLoading(false);
    }
  };

  const variant = isOn ? "solid" : "soft"

  return (
    <Button
      variant={variant}
      size="lg"
      loading={loading}
      onClick={toggleBulb}
    >
      {isOn ? "Turn Bulb Off" : "Turn Bulb On"}
    </Button>
  );
}
