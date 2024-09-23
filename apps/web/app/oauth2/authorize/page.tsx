import type { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Form, type FormState } from '@brickninja-org/ui/components/form';
import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { Notice } from '@brickninja-org/ui/components/notice';

import { AuthorizationType, type User } from '@bn2me/database';
import { Scope } from '@bn2me/client';

import { getSession, getUser } from '@/lib/session';
import { db } from '@/lib/db';
import { OAuth2ErrorCode } from '@/lib/oauth/error';
import { createRedirectUrl } from '@/lib/redirect-url';
import { LoginForm } from 'app/login/form';

import { authorize, type AuthorizeActionParams, authorizeInternal } from './actions';
import { getApplicationByClientId, validateRequest, type AuthorizeRequestParams } from './validate';
import { hasBn2Scopes } from '@/lib/scope';

interface AuthorizePageProps {
  searchParams: Partial<AuthorizeRequestParams> & Record<string, string>;
}

export default async function AuthorizePage({ searchParams }: AuthorizePageProps) {
  //build return url for /account/add?return=X
  const returnUrl = `/oauth2/authorize?${new URLSearchParams(searchParams).toString()}`;

  // validate request
  const { error, request } = await validateRequest(searchParams);

  if (error !== undefined) {
    return <Notice color="error">{error}</Notice>;
  }

  // get current user
  const session = await getSession();
  const user = await getUser();

  // declare some variables for easier access
  const application = await getApplicationByClientId(request.client_id);
  const previousAuthorization = session ? await getPreviousAuthorization(application.id, session.userId) : undefined;
  const previousScopes = new Set(previousAuthorization?.scope as Scope[]);
  const previousAccountIds = previousAuthorization?.accounts.map(({ id }) => id) ?? [];
  const scopes = new Set(decodeURIComponent(request.scope).split(' ') as Scope[]);
  const redirect_uri = new URL(request.redirect_uri);

  // normalize the previous scopes
  normalizeScopes(previousScopes);

  const verifiedAccountsOnly = scopes.has(Scope.Accounts_Verified) && request.verified_accounts_only === 'true';

  // get new/existing scopes
  const newScopes = Array.from(scopes).filter((scope) => !previousScopes.has(scope));
  const oldScopes = Array.from(previousScopes).filter((scope) => scopes.has(scope));

  // build params for the authorize action
  const authorizeActionParams: AuthorizeActionParams = {
    applicationId: application.id,
    redirect_uri: redirect_uri.toString(),
    scopes: Array.from(scopes),
    state: request.state,
    codeChallenge: request.code_challenge ? `${request.code_challenge_method}:${request.code_challenge}` : undefined,
  };

  // handle prompt!=consent
  const allPreviouslyAuthorized = newScopes.length === 0;
  let autoAuthorizeState: FormState | undefined;
  if (allPreviouslyAuthorized && request.prompt !== 'consent') {
    autoAuthorizeState = await authorizeInternal(authorizeActionParams, previousAccountIds);
  }

  // handle prompt=none
  if (!allPreviouslyAuthorized && request.prompt === 'none') {
    const errorUrl = createRedirectUrl(redirect_uri, {
      state: request.state,
      error: OAuth2ErrorCode.access_denied,
      error_description: 'user not previously authorized',
    });

    redirect(errorUrl.toString());
  }

  // get accounts
  const bn2Permissions = Array.from(scopes).filter((scope) => scope.startsWith('bn2:')).map((permission) => permission.substring(4));
  const accounts = session && scopes.has(Scope.Accounts)
    ? await db.account.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true, accountName: true, displayName: true, verified: true,
          _count: { select: { apiTokens: { where: { permissions: { hasEvery: bn2Permissions }}}}}
        }
      })
    : [];

  // build cancel url
  const cancelUrl = createRedirectUrl(redirect_uri, {
    state: request.state,
    error: OAuth2ErrorCode.access_denied,
    error_description: 'user canceled authorization',
  });

  // bind parameters to authorize action
  const authorizeAction = authorize.bind(null, authorizeActionParams);

  return (
    <>
      <div className="header grid items-center gap-[8px_16px] pb-4 border-b-2">
        <span className="font-bitter font-bold self-end">{application.name}</span>
        <span className="self-start">{application.owner.name}</span>
      </div>
      {!session || !user ? (
        <>
          <p>To authorize this application, you need to log in first.</p>
          <LoginForm returnTo={returnUrl}/>
          <LinkButton external href={cancelUrl.toString()} flex appearance="tertiary" className="">Cancel</LinkButton>
        </>
      ) : (
        <Form action={authorizeAction} initialState={autoAuthorizeState}>
          <div className="">
            {newScopes.length === 0 ? (
              <p>{application.name} wants to reauthorize access to your bn2.me account.</p>
            ) : oldScopes.length === 0 ? (
              <p>{application.name} wants to access the following data of your bn2.me account.</p>
            ) : (
              <p>{application.name} wants to access additional data.</p>
            )}

            {newScopes.length > 0 && renderScopes(newScopes, user)}
          </div>
        </Form>
      )}
    </>
  );
}

export interface ScopeItemProps {
  // icon: IconProp;
  children: ReactNode;
}

const ScopeItem: FC<ScopeItemProps> = ({ /* icon, */ children }) => {
  return <li className="grid [grid-template-columns:_16px_auto] gap-3 rounded-sm border leading-6"><div>{children}</div></li>;
};

function getPreviousAuthorization(applicationId: string, userId: string) {
  return db.authorization.findFirst({
    where: { applicationId, userId, type: { not: AuthorizationType.Code }},
    include: { accounts: { select: { id: true }}}
  });
}

const bn2Scopes = Object.values(Scope).filter((scope) => scope.startsWith('bn2:'));

function normalizeScopes(scopes: Set<Scope>): void {
  // include `accounts` if any bn2 or sub scope is included
  if (bn2Scopes.some((scope) => scopes.has(scope)) || scopes.has(Scope.Accounts_Verified)) {
    scopes.add(Scope.Accounts);
  }
}

function renderScopes(scopes: Scope[], user: User) {
  return (
    <ul className="m-0 p-0 list-none">
      {scopes.includes(Scope.Identify) && <ScopeItem>Your username <strong>{user.name}</strong></ScopeItem>}
      {hasBn2Scopes(scopes) && (
        <ScopeItem>
          <p className="">Read-only access to the brick.ninja API</p>
        </ScopeItem>
      )}
    </ul>
  );
}
