import type { IntrospectTokenResponse } from '@bn2me/client';

import { db } from '@/lib/db';
import { isExpired, toTimestamp } from '@/lib/date';
import { assert } from '@/lib/oauth/assert';
import { OAuth2ErrorCode } from '@/lib/oauth/error';

import { handleRequest, handleOptionsRequest } from '../../request';

export const POST = handleRequest(async ({ params, requestAuthorization }): Promise<IntrospectTokenResponse> => {
  const token = params['token'];
  assert(token, OAuth2ErrorCode.invalid_request, 'Missing token parameter');

  // load authorization
  const authorization = await db.authorization.findFirst({
    where: { token, clientId: requestAuthorization.client.id },
  });

  // verify token exists and is not expired
  if(!authorization || isExpired(authorization.expiresAt)) {
    return { active: false };
  }

  const common: IntrospectTokenResponse.Active.Common = {
    active: true,
    client_id: authorization.clientId,
    scope: authorization.scope.join(' '),
    exp: authorization.expiresAt ? toTimestamp(authorization.expiresAt) : undefined,
  };

  return authorization.dpopJkt
    ? { ...common, token_type: 'DPoP', cnf: { jkt: authorization.dpopJkt }}
    : { ...common, token_type: 'Bearer' };
});

export const OPTIONS = handleOptionsRequest();
