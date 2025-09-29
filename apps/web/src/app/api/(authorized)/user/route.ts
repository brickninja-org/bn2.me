import type { UserResponse } from '@bn2me/client';

import { NextResponse } from 'next/server';

import { Scope } from '@bn2me/client';
import { Authorization } from '@bn2me/database';

import { db } from '@/lib/db';
import { withAuthorization } from '../auth';

export const GET = withAuthorization([Scope.Identify])(
  async (authorization: Authorization) => {
    const user = await db.user.findUnique({
      where: { id: authorization.userId },
      select: { id: true, name: true }
    });

    if (!user) {
      return NextResponse.json({ error: true }, { status: 404 });
    }

    // load email and settings
    const grant = await db.applicationGrant.findUnique({
      where: { userId_applicationId: { userId: authorization.userId, applicationId: authorization.applicationId }},
      select: { email: authorization.scope.includes(Scope.Email), settings: true },
    });

    if (!grant) {
      return NextResponse.json({ error: true }, { status: 404 });
    }

    const { email, settings } = grant;

    const response: UserResponse = {
      sub: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: email?.email,
        emailVerified: email?.verified,
      },
      settings: settings?.settings ?? undefined,
    };

    return NextResponse.json(response);
  }
);
