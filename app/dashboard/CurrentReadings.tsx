"use client";

import styles from "../dashboard/dashboard.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useWebSocket from "../hooks/useSensorData";

export default function CurrentReadings() {
  const { sensorData } = useWebSocket();

  // console.log(
  //   `Sensor Data: ${sensorData.temperature} ${sensorData.humidity} \n Bulb Status: ${bulbStatus} \n ESP Health: ${healthStatus}`
  // );

  return (
    <div className={styles.current_readings}>
      <div className={styles.gauges}>
        {/* <p>Temperature</p> */}
        <CircularProgressbar
          value={Math.min(sensorData.temperature, 100)}
          text={`${sensorData.temperature.toFixed(1)}°C`}
          styles={buildStyles({
            pathColor: "#f87171",
            textColor: "#f87171",
          })}
        />
      </div>
      <div className={styles.gauges}>
        {/* <p>Humidity</p> */}
        <CircularProgressbar
          value={Math.min(sensorData.humidity, 100)}
          text={`${sensorData.humidity.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: "#60a5fa",
            textColor: "#60a5fa",
          })}
        />
      </div>
    </div>
  );
}
