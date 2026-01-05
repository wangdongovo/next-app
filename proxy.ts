import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 允许未登录访问的路径
const publicPaths = ['/']

export function proxy(request: NextRequest) {
  // 获取用户的登录状态（从cookie中）
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  
  // 检查当前路径是否需要认证
  const pathname = request.nextUrl.pathname
  const requiresAuth = !publicPaths.includes(pathname)
  
  if (requiresAuth && !isLoggedIn) {
    // 未登录且访问受保护路径，重定向到首页并添加showLogin参数
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('showLogin', 'true')
    return NextResponse.redirect(redirectUrl)
  }
  
  // 允许访问
  return NextResponse.next()
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}