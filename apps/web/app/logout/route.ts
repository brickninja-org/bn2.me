import type { NextRequest } from 'next/server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

import { LoginErrorCookieName, SessionCookieName } from '@/lib/cookie';
import { db } from '@/lib/db';
import { getUrlFromRequest } from '@/lib/url';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  if (!cookieStore.has(SessionCookieName)) {
    redirect('/login');
  }

  // get the session id
  const sessionId = cookieStore.get(SessionCookieName)!.value;

  // try to delete session in db if set
  // use deleteMany instead of delete so it doesn't fail if there is no matching session in db
  await db.userSession.deleteMany({ where: { id: sessionId }});

  // delete session cookie
  cookieStore.delete(SessionCookieName);
  cookieStore.delete(LoginErrorCookieName);

  // set cookie to show logout
  const url = getUrlFromRequest(request);
  return NextResponse.redirect(
    new URL('/login', url),
    { headers: { 'Set-Login': 'logged-out' }},
  );
}
