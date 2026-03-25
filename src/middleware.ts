import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache control for API routes with auth data
  if (request.nextUrl.pathname.startsWith('/api/store/') ||
      request.nextUrl.pathname.startsWith('/api/auth/')) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.json).*)',
  ],
};
