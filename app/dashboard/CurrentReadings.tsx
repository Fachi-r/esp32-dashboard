// app/dashboard/CurrentReadings.tsx
'use client';

import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type SensorData = {
  temperature: number;
  humidity: number;
};

export default function CurrentReadings() {
  const [data, setData] = useState<SensorData | null>(null);

  const fetchLatestData = async () => {
    const res = await fetch('/api/sensor-data', { cache: 'no-store' });
    const rows = await res.json();
    if (rows.length > 0) {
      setData(rows[0]);
    }
  };

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex gap-8 justify-center">
      <div className="w-40">
        <CircularProgressbar
          value={Math.min(data.temperature, 100)}
          text={`${data.temperature.toFixed(1)}°C`}
          styles={buildStyles({
            pathColor: '#f87171',
            textColor: '#f87171',
          })}
        />
      </div>
      <div className="w-40">
        <CircularProgressbar
          value={Math.min(data.humidity, 100)}
          text={`${data.humidity.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: '#60a5fa',
            textColor: '#60a5fa',
          })}
        />
      </div>
    </div>
  );
}
