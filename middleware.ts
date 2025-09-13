import { NextRequest, NextResponse } from 'next/server';

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    // Verify the Firebase ID token server-side
    const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token
      })
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const user = data.users?.[0];
    
    if (!user) {
      return false;
    }

    // Check if user email is authorized
    const isAuthorized = user.email === process.env.ADMIN_EMAIL || user.email === process.env.CLIENT_EMAIL;
    return isAuthorized;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      // If already has valid token, redirect to dashboard
      const adminToken = request.cookies.get('admin-token')?.value;
      if (adminToken) {
        const isValid = await verifyAdminToken(adminToken);
        if (isValid) {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else {
          // Clear invalid token
          const response = NextResponse.next();
          response.cookies.delete('admin-token');
          return response;
        }
      }
      return NextResponse.next();
    }

    // Check for admin token and verify it
    const adminToken = request.cookies.get('admin-token')?.value;
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token is valid and user is authorized
    const isValidToken = await verifyAdminToken(adminToken);
    
    if (!isValidToken) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
