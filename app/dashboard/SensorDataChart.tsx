// app/dashboard/SensorDataChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type SensorData = {
  id: number;
  temperature: number;
  humidity: number;
  inserted_at: string;
};

export default function SensorDataChart() {
  const [data, setData] = useState<SensorData[]>([]);

  const fetchSensorData = async () => {
    const res = await fetch('/api/sensor-data', { cache: 'no-store' });
    const rows = await res.json();
    setData(rows.reverse()); // oldest first
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="inserted_at" hide />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#f87171" name="Temperature (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#60a5fa" name="Humidity (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
