"use client";

import { useState } from "react";

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

  return (
    <button
      onClick={toggleBulb}
      disabled={loading}
      className={`px-4 py-2 rounded text-white font-semibold ${
        isOn ? "bg-green-600" : "bg-gray-600"
      } hover:opacity-90 transition`}
    >
      {loading ? "Sending..." : isOn ? "Turn Off" : "Turn On"}
    </button>
  );
}
