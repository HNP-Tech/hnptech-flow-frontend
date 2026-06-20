import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

//export function middleware(request: NextRequest) {
//  const isLoginPage = request.nextUrl.pathname === '/login';
//  const hasUserCookie = request.cookies.has('user'); // Sử dụng cookie thay vì localStorage

  // Nếu chưa login và không phải trang login → redirect về login
//  if (!hasUserCookie && !isLoginPage) {
//    return NextResponse.redirect(new URL('/login', request.url));
//  }

  // Nếu đã login mà vào trang login → redirect về dashboard
//  if (hasUserCookie && isLoginPage) {
//    return NextResponse.redirect(new URL('/', request.url));
//  }

//  return NextResponse.next();
//}

//export const config = {
//  matcher: ['/', '/workflow/:path*', '/hr/:path*', '/reports/:path*'],
//}; */