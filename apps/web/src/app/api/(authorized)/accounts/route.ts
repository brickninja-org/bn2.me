import type { AccountsResponse } from '@bn2me/client';

import { NextResponse } from 'next/server';

import { Scope } from '@bn2me/client';
import { Authorization } from '@bn2me/database';

import { Bn2Scopes, getApplicationGrantByAuthorization, OptionsHandler, withAuthorization } from '../auth';

export const GET = withAuthorization({ oneOf: [...Bn2Scopes, Scope.Accounts] })(
  async (authorization: Authorization) => {
    const applicationGrant = getApplicationGrantByAuthorization(authorization);
    const [accounts] = await Promise.all([
      applicationGrant.accounts({
        orderBy: { createdAt: 'asc' },
        select: {
          accountId: true,
          accountName: true,
          displayName: authorization.scope.includes(Scope.Accounts_DisplayName),
          verified: authorization.scope.includes(Scope.Accounts_Verified),
        },
      }),
    ]);

    const response: AccountsResponse = {
      accounts: [
        ...(accounts ?? []).map(({ accountId, accountName, displayName, verified }) => ({
          id: accountId,
          name: accountName,
          verified,
          displayName,
        })),
      ],
    };

    return NextResponse.json(response);
  }
);

export const OPTIONS = OptionsHandler;
