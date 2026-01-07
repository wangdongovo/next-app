import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return decoded;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}