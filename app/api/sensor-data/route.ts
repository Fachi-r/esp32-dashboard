import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const data =
      await sql`SELECT * FROM sensor_data ORDER BY inserted_at ASC LIMIT 15`;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { temperature, humidity } = await req.json();
    await sql`INSERT INTO sensor_data (temperature, humidity) VALUES (${temperature}, ${humidity})`;
    return NextResponse.json({ message: "Data inserted" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ status: 500, error: error.message });
  }
}
