import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  return NextResponse.json({
    status: 'healthy',
    service: 'web',
    timestamp: new Date().toISOString(),
    uptime: `${hours}h${minutes}m${seconds}s`,
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
  });
}
