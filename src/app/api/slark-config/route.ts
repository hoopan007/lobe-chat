import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SLARK_PATH_PRICING: process.env.NEXT_PUBLIC_SLARK_PATH_PRICING || '',
    NEXT_PUBLIC_SLARK_PATH_SETTINGS: process.env.NEXT_PUBLIC_SLARK_PATH_SETTINGS || '',
    NEXT_PUBLIC_SLARK_URL: process.env.NEXT_PUBLIC_SLARK_URL || '',
  });
} 