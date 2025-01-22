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

    const email = authorization.emailId
      ? await db.userEmail.findUnique({
        where: { id: authorization.emailId },
        select: { email: true, verified: true }
      })
      : undefined;

    if(!user) {
      return NextResponse.json({ error: true }, { status: 404 });
    }

    const response: UserResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: email?.email,
        emailVerified: email?.verified,
      }
    };

    return NextResponse.json(response);
  }
);
