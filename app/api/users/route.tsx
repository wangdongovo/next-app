// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  // 验证用户身份
  const decoded = verifyToken(request);
  if (decoded instanceof NextResponse) {
    return decoded;
  }

  // 获取查询参数
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || '';

  // 计算偏移量
  const offset = (page - 1) * limit;

  try {
    // 构建查询和参数
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const conditions: string[] = [];
    const params: any[] = [];

    // 添加搜索条件
    if (search) {
      conditions.push('(username LIKE ? OR nickname LIKE ? OR email LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // 组合查询条件
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // 添加分页（注意：直接使用字符串拼接，避免预处理语句的参数问题）
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    // 执行查询
    const [users] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, params);
    const total = (countResult as any[])[0].total;

    // 返回结果
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}