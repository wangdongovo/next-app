import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 公开路由白名单
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/favicon.ico',
  '/api/auth/callback',
];

// 检查路由是否在白名单中
function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has('isLoggedIn');

  // 如果是公开路由，直接放行
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 如果不是公开路由且未登录，重定向到首页
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 已登录且是受保护路由，放行
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};