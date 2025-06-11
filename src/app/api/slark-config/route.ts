import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    SLARK_PATH_PRICING: process.env.SLARK_PATH_PRICING || '',
    SLARK_PATH_SETTINGS: process.env.SLARK_PATH_SETTINGS || '',
    SLARK_URL: process.env.SLARK_URL || '',
  });
} 