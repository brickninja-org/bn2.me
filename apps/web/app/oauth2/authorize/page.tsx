import type { FC, ReactNode } from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Icon, IconProp } from '@brickninja-org/ui';

import { Form, type FormState } from '@brickninja-org/ui/components/form/Form';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Select } from '@brickninja-org/ui/components/form/Select';

import { AuthorizationType, User, UserEmail } from '@bn2me/database';
import { Scope } from '@bn2me/client';

import { db } from '@/lib/db';
import { PageProps, searchParamsToURLSearchParams } from '@/lib/next';
import { OAuth2ErrorCode } from '@/lib/oauth/error';
import { createRedirectUrl } from '@/lib/redirect-url';
import { hasBn2Scopes } from '@/lib/scope';
import { getSession, getUser } from '@/lib/session';

import { LoginForm } from 'app/login/form';
import { authorize, type AuthorizeActionParams, authorizeInternal } from './actions';
import { getApplicationByClientId, validateRequest } from './validate';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';
import Link from 'next/link';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Expandable } from '@/components/expandable/Expandable';
import { PermissionList } from '@/components/permission/PermissionList';

export default async function AuthorizePage({ searchParams: asyncSearchParams }: PageProps) {
  const searchParams = await asyncSearchParams;

  // build return url for /account/add?return=X
  const returnUrl = `/oauth2/authorize?${searchParamsToURLSearchParams(searchParams).toString()}`;

  // validate request
  const { error, request } = await validateRequest(searchParams);

  if(error !== undefined) {
    return <Notice type="error">{error}</Notice>;
  }

  // get current user
  const session = await getSession();
  const user = await getUser();

  // declare some variables for easier access
  const client = await getApplicationByClientId(request.client_id);
  const previousAuthorization = session ? await getPreviousAuthorization(request.client_id, session.userId) : undefined;
  const previousScope = new Set(previousAuthorization?.scope as Scope[]);
  const previousAccountIds = previousAuthorization?.accounts.map(({ id }) => id) ?? [];
  const scopes = new Set(decodeURIComponent(request.scope).split(' ') as Scope[]);
  const redirect_uri = new URL(request.redirect_uri);

  // normalize the previous scopes
  normalizeScopes(previousScope);

  // if `include_granted_scopes` is set add all previous scopes to the current scopes
  if(request.include_granted_scopes) {
    previousScope.forEach((scope) => scopes.add(scope));
  }

  // normalize the current scopes
  normalizeScopes(scopes);

  const verifiedAccountsOnly = scopes.has(Scope.Accounts_Verified) && request.verified_accounts_only === 'true';

  // get new/existing scopes
  const newScopes = Array.from(scopes).filter((scope) => !previousScope.has(scope));
  const oldScopes = Array.from(previousScope).filter((scope) => scopes.has(scope));

  // build params for the authorize action
  const authorizeActionParams: AuthorizeActionParams = {
    clientId: request.client_id,
    redirect_uri: redirect_uri.toString(),
    scopes: Array.from(scopes),
    state: request.state,
    codeChallenge: request.code_challenge ? `${request.code_challenge_method}:${request.code_challenge}` : undefined,
  };

  // handle prompt!=consent
  const allPreviouslyAuthorized = newScopes.length === 0;
  let autoAuthorizeState: FormState | undefined;
  if(allPreviouslyAuthorized && request.prompt !== 'consent') {
    autoAuthorizeState = await authorizeInternal(authorizeActionParams, previousAccountIds, previousAuthorization?.emailId ?? undefined);
  }

  // handle prompt=none
  if(!allPreviouslyAuthorized && request.prompt === 'none') {
    const errorUrl = await createRedirectUrl(redirect_uri, {
      state: request.state,
      error: OAuth2ErrorCode.access_denied,
      error_description: 'user not previously authorized',
    });

    redirect(errorUrl.toString());
  }

  // get emails
  const emails = user && scopes.has(Scope.Email)
    ? await db.userEmail.findMany({ where: { userId: user.id }, orderBy: { email: 'asc' }})
    : [];

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
  const cancelUrl = await createRedirectUrl(redirect_uri, {
    state: request.state,
    error: OAuth2ErrorCode.access_denied,
    error_description: 'user canceled authorization',
  });

  // bind parameters to authorize action
  const authorizeAction = authorize.bind(null, authorizeActionParams);

  return (
    <>
      <div className="flex gap-[8px_16px] items-center pb-4 border-b-2">
        <ApplicationImage fileId={client.application.imageId} size={64}/>
        <div className="flex flex-col">
          <span className="font-bitter font-bold text-lg self-end">{client.application.name}</span>
          <span className="self-start text-gray-700">by {client.application.owner.name}</span>
        </div>
      </div>
      {!session || !user ? (
        <>
          <p className="mb-0">To authorize this application, you need to log in first.</p>
          <LoginForm returnTo={returnUrl}/>
          <LinkButton external href={cancelUrl.toString()} flex appearance="tertiary" className="justify-center">Cancel</LinkButton>
        </>
      ) : (
        <Form action={authorizeAction} initialState={autoAuthorizeState}>
          <div className="flex flex-wrap gap-4 pt-4">
            {newScopes.length === 0 ? (
              <p className="mb-0">{client.application.name} wants to reauthorize access to your bn2.me account.</p>
            ) : oldScopes.length === 0 ? (
              <p className="mb-0">{client.application.name} wants to access the following data of your bn2.me account.</p>
            ) : (
              <p className="mb-0">{client.application.name} wants to access additional data.</p>
            )}

            {newScopes.length > 0 && renderScopes(newScopes, user, emails, previousAuthorization?.emailId ?? user.defaultEmail?.id, returnUrl)}

            {oldScopes.length > 0 && (
              <Expandable label="Show previously authorized permissions.">
                {renderScopes(oldScopes, user, emails, previousAuthorization?.emailId ?? user.defaultEmail?.id, returnUrl)}
              </Expandable>
            )}

            {scopes.has(Scope.Accounts) && (
              <div className="-mx-4 px-4 border-1 border-gray-700 bg-gray-200">
                Select Accounts {verifiedAccountsOnly && '(Verified only)'}
                <div className="flex flex-col w-full mt-4">
                  {accounts.map((account) => (
                    <Checkbox key={account.id} defaultChecked={previousAccountIds.includes(account.id) && (account.verified || !verifiedAccountsOnly)} name="accounts" formValue={account.id} disabled={!account.verified && verifiedAccountsOnly}>
                      <FlexRow>
                        {account.displayName ? <>{account.displayName} <span style={{ color: 'var(--color-text-muted)' }}>({account.accountName})</span></> : account.accountName}
                        {verifiedAccountsOnly && !account.verified && (<Tip tip="Not verified"><Icon icon="unverified"/></Tip>)}
                        {!verifiedAccountsOnly && account.verified && (<Tip tip="Verified"><Icon icon="verified"/></Tip>)}
                        {account._count.apiTokens === 0 && (
                          <Tip tip="No API key of this account has all requested permissions">
                            <Icon icon="warning" color="#ffa000"/>
                          </Tip>
                        )}
                      </FlexRow>
                    </Checkbox>
                  ))}
                  <LinkButton href={`/accounts/add?return=${encodeURIComponent(returnUrl)}`} appearance="menu" icon="add">Add account</LinkButton>
                </div>
              </div>
            )}

            <p className="mb-0 text-sm">
              The above data will be shared with {client.application.name} in accordance with their
              {' '}{client.application.privacyPolicyUrl ? <Link href={client.application.privacyPolicyUrl}>privacy policy</Link> : 'privacy policy'} and
              {' '}{client.application.termsOfServiceUrl ? <Link href={client.application.termsOfServiceUrl}>terms of service</Link> : 'terms of service'}.
              You can revoke access at anytime from your <Link href="/profile">bn2.me profile</Link>.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 border-t-2">
              <LinkButton external href={cancelUrl.toString()} flex className="justify-center">Cancel</LinkButton>
              <SubmitButton icon="gw2me-outline" type="submit" flex className="justify-center border-green-800 bg-green-200 text-green-800">Authorize {client.application.name}</SubmitButton>
            </div>

            <div className="text-center text-sm text-gray-700">Authorizing will redirect you to <b>{redirect_uri.origin}</b></div>
          </div>
        </Form>
      )}
    </>
  );
}

export async function generateMetadata({ searchParams: asyncSearchParams }: PageProps): Promise<Metadata> {
  const searchParams = await asyncSearchParams;
  const { error, request } = await validateRequest(searchParams);

  if(error !== undefined) {
    return {
      title: error
    };
  }

  const application = await getApplicationByClientId(request.client_id);

  return {
    title: `Authorize ${application.application.name}`
  };
}

export interface ScopeItemProps {
  icon: IconProp
  children: ReactNode;
}

const ScopeItem: FC<ScopeItemProps> = ({ icon, children }) => {
  return <li className="flex gap-3 py-1 px-4 border rounded-xs"><Icon icon={icon}/><div className="flex flex-col">{children}</div></li>;
};

function getPreviousAuthorization(clientId: string, userId: string) {
  return db.authorization.findFirst({
    where: { clientId, userId, type: { not: AuthorizationType.Code }},
    include: { accounts: { select: { id: true }}}
  });
}

const bn2Scopes = Object.values(Scope).filter((scope) => scope.startsWith('bn2:'));

function normalizeScopes(scopes: Set<Scope>): void {
  // include `accounts` if any bn2 or sub scope is included
  if(bn2Scopes.some((scope) => scopes.has(scope)) || scopes.has(Scope.Accounts_DisplayName) || scopes.has(Scope.Accounts_Verified)) {
    scopes.add(Scope.Accounts);
  }
}

function renderScopes(scopes: Scope[], user: User & { defaultEmail: null | { id: string }}, emails: UserEmail[], emailId: undefined | string, returnUrl: string) {
  return (
    <ul className="w-full flex flex-col gap-1.5">
      {scopes.includes(Scope.Identify) && <ScopeItem icon="user">Your username <b>{user.name}</b></ScopeItem>}
      {scopes.includes(Scope.Email) && (
        <ScopeItem icon="mail">
          <p className="mb-0">Your email address</p>
          <div style={{ marginBlock: 8, display: 'flex', gap: 16 }}>
            {emails.length > 0 && (<Select name="email" options={emails.map(({ id, email }) => ({ label: email, value: id }))} defaultValue={emailId}/>)}
            <LinkButton href={`/emails/add?return=${encodeURIComponent(returnUrl)}`} icon="add">Add Email</LinkButton>
          </div>
        </ScopeItem>
      )}
      {(scopes.includes(Scope.Accounts_DisplayName) && scopes.includes(Scope.Accounts)) ? (
        <ScopeItem icon="nametag">Your Guild Wars 2 account names and custom display names</ScopeItem>
      ) : scopes.includes(Scope.Accounts) ? (
        <ScopeItem icon="nametag">Your Guild Wars 2 account names</ScopeItem>
      ) : scopes.includes(Scope.Accounts_DisplayName) && (
        <ScopeItem icon="nametag">Custom display names for your Guild Wars 2 accounts</ScopeItem>
      )}
      {scopes.includes(Scope.Accounts_Verified) && <ScopeItem icon="verified">Your Brickset account verification status</ScopeItem>}
      {hasBn2Scopes(scopes) && (
        <ScopeItem icon="developer">
          <p className="mb-0">Read-only access to the Brickset API</p>
          <PermissionList permissions={scopes.filter((scope) => scope.startsWith('bn2:')).map((permission) => permission.substring(4))}/>
        </ScopeItem>
      )}
    </ul>
  );
}
