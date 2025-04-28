"use client";

import styles from "../dashboard/dashboard.module.css";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type SensorData = {
  temperature: number;
  humidity: number;
};

export default function CurrentReadings() {
  const [data, setData] = useState<SensorData | null>(null);

  const fetchLatestData = async () => {
    const res = await fetch("/api/sensor-data", { cache: "no-store" });
    const { data } = await res.json();
    // console.log(data[0]);

    if (data.length > 0) {
      setData(data[0]);
    }
  };

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    // <div className="flex gap-8 justify-center">
    <div className={styles.current_readings}>
      <div className={styles.gauges}>
        <CircularProgressbar
          // value={Math.min(22.5, 100)}
          // text={`22.5°C`}
          value={Math.min(data.temperature, 100)}
          text={`${data.temperature.toFixed(1)}°C`}
          styles={buildStyles({
            pathColor: "#f87171",
            textColor: "#f87171",
          })}
        />
      </div>
      <div className={styles.gauges}>
        <CircularProgressbar
          // value={Math.min(68, 100)}
          // text={`68%`}
          value={Math.min(data.humidity, 100)}
          text={`${data.humidity.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: "#60a5fa",
            textColor: "#60a5fa",
          })}
        />
      </div>
    </div>
  );
}
