import type { AccountsResponse } from '@bn2me/client';

import { NextResponse } from 'next/server';

import { Scope } from '@bn2me/client';
import { Authorization } from '@bn2me/database';

import { db } from '@/lib/db';
import { corsHeaders } from '@/lib/cors-header';

import { Bn2Scopes, withAuthorization } from '../auth';

export const GET = withAuthorization({ oneOf: [...Bn2Scopes, Scope.Accounts] })(
  async (authorization: Authorization) => {
    const accounts = await db.account.findMany({
      where: { authorizations: { some: { id: authorization.id }}},
      orderBy: { createdAt: 'asc' },
      select: {
        accountId: true,
        accountName: true,
        displayName: authorization.scope.includes(Scope.Accounts_DisplayName),
        verified: authorization.scope.includes(Scope.Accounts_Verified)
      }
    });

    const response: AccountsResponse = {
      accounts: accounts.map(({ accountId, accountName, displayName, verified }) => ({
        id: accountId,
        name: accountName,
        verified,
        displayName
      }))
    };

    return NextResponse.json(response);
  }
);

export const OPTIONS = (request: Request) => {
  return new NextResponse(null, {
    headers: corsHeaders(request)
  });
};
