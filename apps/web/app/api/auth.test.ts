import { NextRequest, NextResponse } from 'next/server';

import { Scope } from '@bn2me/client';
import { Authorization, AuthorizationType } from '@bn2me/database';

import { corsHeaders } from '@/lib/cors-header';
import { db } from '@/lib/db';

type AuthorizedRouteHandler<Context> =
 | ((authorization: Authorization) => Promise<Response>)
 | ((authorization: Authorization, request: NextRequest) => Promise<Response>)
 | ((authorization: Authorization, request: NextRequest, context: Context) => Promise<Response>);

type RouteHandler<Context> = ((request: NextRequest, context: Context) => Promise<Response>);

export function withAuthorization<Context>(scopes?: Scope[] | { oneOf: Scope[] }): (handler: AuthorizedRouteHandler<Context>) => RouteHandler<Context> {
  return function(handler) {
    return async function(request: NextRequest, context: Context) {
      // get authorization header
      const auth = request.headers.get('Authorization');

      if(!auth) {
        return NextResponse.json({ error: true }, { status: 401 });
      }

      // verify that header is "Bearer <token>"
      const [tokenType, token] = auth.split(' ');

      if(tokenType !== 'Bearer' || !token) {
        return NextResponse.json({ error: true }, { status: 400 });
      }

      // find authorization in db
      const authorization = await db.authorization.findUnique({
        where: {
          type_token: { token, type: AuthorizationType.AccessToken },
          OR: [
            { expiresAt: { gte: new Date() }},
            { expiresAt: null }
          ]
        },
      });

      // verify that the token has the required scopes for the current endpoint
      if(!authorization || !verifyScopes(authorization.scope as Scope[], scopes)) {
        return NextResponse.json({ error: true }, { status: 401 });
      }

      // set last use timestamp
      await db.authorization.update({
        where: { id: authorization.id },
        data: { usedAt: new Date() }
      });

      // run endpoint handler
      const response = await handler(authorization, request, context);

      // add cors headers
      const cors = corsHeaders(request);
      response.headers.append('Vary', cors.Vary);

      if('Access-Control-Allow-Origin' in cors) {
        response.headers.append('Access-Control-Allow-Origin', cors['Access-Control-Allow-Origin']);
      }

      // return response
      return response;
    };
  };
}

export const Bn2Scopes = [Scope.BN2_Account, Scope.BN2_Collections];

export function verifyScopes(authorized: Scope[], condition: undefined | Scope[] | { every?: Scope[], oneOf?: Scope[] }): boolean {
  if(!condition) {
    return true;
  }

  const { every, oneOf } = Array.isArray(condition)
    ? { every: condition, oneOf: [] }
    : { every: [], oneOf: [], ...condition };

  const hasEvery = every.every((scope) => authorized.includes(scope));

  if(!hasEvery) {
    return false;
  }

  const hasOneOf = oneOf.length === 0 || oneOf.some((scope) => authorized.includes(scope));

  if(!hasOneOf) {
    return false;
  }

  return true;
}
