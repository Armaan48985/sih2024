import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Retrieve the session token from cookies
  const token = req.cookies.get('session');

  if (!token) {
    // Redirect to the login page if no session token is found
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Optional: Add token verification logic here if needed

  // Allow the request to proceed if the session token exists
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/profile', '/'], // Apply middleware to these routes
};
