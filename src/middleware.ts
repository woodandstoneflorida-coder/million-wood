import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/auth-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only protect paths under /control-interno
  if (pathname.startsWith('/control-interno')) {
    const sessionCookie = request.cookies.get('mw_session')?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    // 1. If accessing the login page exactly:
    if (pathname === '/control-interno') {
      if (session) {
        // If already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/control-interno/dashboard', request.url));
      }
      // Otherwise, let them see the login page
      return NextResponse.next();
    }

    // 2. If accessing any sub-route (e.g., /control-interno/dashboard):
    if (!session) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL('/control-interno', request.url));
    }
  }

  return NextResponse.next();
}

// Config to only run middleware on relevant routes to save performance
export const config = {
  matcher: ['/control-interno/:path*'],
};
