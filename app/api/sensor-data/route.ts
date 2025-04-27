// app/api/sensor-data/route.ts
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM sensor_data ORDER BY inserted_at DESC LIMIT 50');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { temperature, humidity } = await req.json();
    await pool.query(
      'INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2)',
      [temperature, humidity]
    );
    return NextResponse.json({ message: 'Data inserted' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
