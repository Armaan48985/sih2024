// app/api/set-session-cookie/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token } = await req.json(); // Get token from the request body

    // Set session cookie
    const response = NextResponse.json({ message: 'Session cookie set' });
    response.cookies.set('session', token, { httpOnly: true, path: '/' }); // Set the cookie

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to set session cookie' }, { status: 500 });
  }
}
