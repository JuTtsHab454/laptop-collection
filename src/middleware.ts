import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

async function getAuthToken(req: NextRequest) {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'laptop-collection-secret-key-32charsmin';

  // 1. Try secure cookie first (Vercel production HTTPS)
  try {
    const tokenSecure = await getToken({ req, secret, secureCookie: true });
    if (tokenSecure) return tokenSecure;
  } catch (err) {}

  // 2. Try standard cookie (localhost HTTP)
  try {
    const tokenStandard = await getToken({ req, secret, secureCookie: false });
    if (tokenStandard) return tokenStandard;
  } catch (err) {}

  // 3. Fallback: try explicit cookie names in case salt/name differences exist
  const candidateCookies = [
    '__Secure-authjs.session-token',
    'authjs.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
  ];

  for (const name of candidateCookies) {
    if (req.cookies.has(name)) {
      try {
        const isSecure = name.startsWith('__Secure-');
        const token = await getToken({ req, secret, cookieName: name, secureCookie: isSecure });
        if (token) return token;
      } catch (err) {}
    }
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getAuthToken(req);
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
