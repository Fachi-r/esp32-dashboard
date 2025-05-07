import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.MQTT_BRIDGE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { command } = await req.json();
  // const status = command

  if (command !== "on" && command !== "off") {
    return NextResponse.json(
      { message: "Invalid command. Must be 'on' or 'off'." },
      { status: 400 }
    );
  }

  // set up a 5s timeout on our HTTP call
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE}/bulb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: command }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[bulb] Bridge responded ${res.status}: ${text}`);
      return NextResponse.json(
        { message: "Bridge error", detail: text },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: `Bulb turned ${command}` },
      { status: 200 }
    );
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("[bulb] Request to bridge timed out");
      return NextResponse.json(
        { message: "Bridge request timed out" },
        { status: 504 }
      );
    }

    console.error("[bulb] Fetch error:", error);
    return NextResponse.json(
      { message: "Failed to toggle bulb", detail: error.message },
      { status: 500 }
    );
  }
}
