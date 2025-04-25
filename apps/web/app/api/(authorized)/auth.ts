import type { NextRequest } from 'next/server';
import type { Authorization } from '@bn2me/database';

import { unstable_rethrow as rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';

import { Scope } from '@bn2me/client';
import { AuthorizationType } from '@bn2me/database';

import { corsHeaders } from '@/lib/cors-header';
import { db } from '@/lib/db';
import { errorToResponse, OAuth2AuthorizationError, OAuth2Error, OAuth2ErrorCode } from '@/lib/oauth/error';
import { assert } from 'console';
import { checkProof } from '@/lib/oauth/dpop';
import { getUrlFromRequest } from '@/lib/url';

type AuthorizedRouteHandler<Context> =
 | ((authorization: Authorization) => Promise<Response>)
 | ((authorization: Authorization, request: NextRequest) => Promise<Response>)
 | ((authorization: Authorization, request: NextRequest, context: Context) => Promise<Response>);

type RouteHandler<Context> = ((request: NextRequest, context: Context) => Promise<Response>);

export function withAuthorization<Context>(scopes?: Scope[] | { oneOf: Scope[] }): (handler: AuthorizedRouteHandler<Context>) => RouteHandler<Context> {
  return function(handler) {
    return async function(request: NextRequest, context: Context) {
      try {
        // get authorization header
        const auth = request.headers.get('Authorization');

        if(!auth) {
          throw new OAuth2AuthorizationError(OAuth2ErrorCode.access_denied, { description: 'Missing authorization' });
        }

        // verify that header is "Bearer <token>"
        const [tokenType, token] = auth.split(' ');

        if((tokenType !== 'Bearer' && tokenType !== 'DPoP') || !token) {
          throw new OAuth2Error(OAuth2ErrorCode.invalid_request, { description: 'Invalid authorization' });
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

        if(!authorization) {
          throw new OAuth2AuthorizationError(OAuth2ErrorCode.access_denied, { description: 'Invalid authorization' });
        }

        // verify DPoP
        if(authorization.dpopJkt) {
          assert(tokenType === 'DPoP', OAuth2ErrorCode.invalid_request, 'Invalid authorization type (expected DPoP)');
          const proof = request.headers.get('DPoP');
          assert(proof, OAuth2ErrorCode.invalid_request);
          await checkProof(proof!, { htm: request.method, htu: getUrlFromRequest(request), accessToken: authorization.token }, authorization.dpopJkt);
        } else {
          assert(tokenType === 'Bearer', OAuth2ErrorCode.invalid_request, 'Invalid authorization type (expected Bearer)');
        }

        // verify that the token has the required scopes for the current endpoint
        if(!verifyScopes(authorization.scope as Scope[], scopes)) {
          throw new OAuth2AuthorizationError(OAuth2ErrorCode.access_denied, { schema: tokenType, description: 'Missing scopes to access this API' });
        }

        // set last use timestamp
        await db.authorization.update({
          where: { id: authorization.id },
          data: { usedAt: new Date() }
        });

        // run endpoint handler
        const response = await handler(authorization, request, context);

        // add response headers
        for(const [name, value] of Object.entries(responseHeaders(request))) {
          response.headers.append(name, value);
        }

        return response;
      } catch (error) {
        // rethrow Next.js errors
        rethrow(error);

        console.error(error);

        // create response
        const response = errorToResponse(error);

        // add headers
        for(const [name, value] of Object.entries(responseHeaders(request))) {
          response.headers.append(name, value);
        }

        return response;
      }
    };
  };
}

export const Bn2Scopes = [];

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

/** Include CORS headers and `Cache-Control: no-store` */
function responseHeaders(request: NextRequest) {
  return {
    ...corsHeaders(request),
    'Cache-Control': 'no-store'
  };
}

export function getApplicationGrantByAuthorization(authorization: Authorization) {
  return db.applicationGrant.findUnique({
    where: { userId_applicationId: { userId: authorization.userId, applicationId: authorization.applicationId }}
  });
}

export function OptionsHandler(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeaders(request), status: 204 });
}
