import { NextRequest, NextResponse } from "next/server";
import mqtt from "mqtt";

export const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "", {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

export async function POST(req: NextRequest) {
  const { command } = await req.json();

  if (command !== "on" && command !== "off") {
    return NextResponse.json({ message: "Invalid command" }, { status: 400 });
  }

  return new Promise((resolve) => {
    mqttClient.publish("home/bulb", command, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
        return resolve(
          NextResponse.json(
            { message: "Failed to send command" },
            { status: 500 }
          )
        );
      }

      resolve(NextResponse.json({ message: `Bulb turned ${command}` }));
    });
  });
}
