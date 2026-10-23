import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'laptop-collection-secret-key-32charsmin',
  });

  const isAuthenticated = !!token;
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin');

  // Allow login page without auth; if already authenticated, redirect to /admin
  if (isAdminLogin) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }
    return NextResponse.next();
  }

  // Protect admin API routes
  if (isAdminApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect all other admin pages
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', req.nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
