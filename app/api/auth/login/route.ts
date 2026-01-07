import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // 检查用户是否存在
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as any[])[0];
    
    let userId;
    
    if (user) {
      // 用户存在，验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      userId = user.id;
    } else {
      // 用户不存在，创建新用户（登录即注册）
      const hashedPassword = await bcrypt.hash(password, 12);
      const [result] = await pool.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      userId = (result as any).insertId;
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId, email },
      (process.env.JWT_SECRET || 'default_secret') as any,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
    );
    
    // 返回令牌和用户信息
    return NextResponse.json({
      success: true,
      token,
      user: { id: userId, email }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}