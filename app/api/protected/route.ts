import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const decoded = verifyToken(request);
  
  if (decoded instanceof NextResponse) {
    return decoded;
  }
  
  return NextResponse.json({
    success: true,
    message: 'This is a protected route',
    user: decoded
  });
}