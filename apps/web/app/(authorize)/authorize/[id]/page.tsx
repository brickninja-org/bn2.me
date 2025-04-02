import { cache, FC, ReactNode } from 'react';

import { IconProp } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';
import { Form, FormState } from '@brickninja-org/ui/components/form/Form';
import { Select } from '@brickninja-org/ui/components/form/Select';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Icon } from '@brickninja-org/ui/icons/Icon';
import { Scope } from '@bn2me/client';
import { AuthorizationRequestState, AuthorizationRequestType, User, UserEmail } from '@bn2me/database';

import { normalizeScopes } from 'app/(authorize)/oauth2/authorize/validate';
import { LoginForm } from 'app/login/form';
import { db } from '@/lib/db';
import { PageProps } from '@/lib/next';
import { isExpired } from '@/lib/date';
import { getSession, getUser } from '@/lib/session';
import { hasBn2Scopes, scopeToPermissions } from '@/lib/scope';
import { ApplicationImage } from '@/components/application/ApplicationImage';
import { Expandable } from '@/components/expandable/Expandable';
import { PermissionList } from '@/components/permission/PermissionList';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';

import { AuthorizationRequest } from '../types';
import { authorize, authorizeInternal, cancelAuthorization } from './actions';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';
import Link from 'next/link';

const getPendingAuthorizationRequest = cache(
  (id: string) => db.authorizationRequest.findUnique({
    where: { id, state: AuthorizationRequestState.Pending },
    include: { client: { include: { application: { include: { owner: true }}}}},
  }),
);

export default async function AuthorizePage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  const selfUrl = `/authorize/${id}`;

  // get the request
  const authRequest = await getPendingAuthorizationRequest(id) as (AuthorizationRequest & { client: NonNullable<Awaited<ReturnType<typeof getPendingAuthorizationRequest>>>['client'] }) | null;

  if (!authRequest) {
    return <Notice type="error">Authorization request not found.</Notice>;
  }

  if (isExpired(authRequest.expiresAt)) {
    // TODO: allow user to go back to application
    return <Notice type="error">Authorization request expired.</Notice>;
  }

  const { client } = authRequest;

  // get current user
  const session = await getSession();
  const user = await getUser();

  // declare some variables for easier access
  const previousAuthorization = session ? await getApplicationGrant(client.applicationId, session.userId) : undefined;
  const previousScope = new Set(previousAuthorization?.scope as Scope[]);
  const previousAccountIds = previousAuthorization?.accounts.map(({ id }) => id) ?? [];
  const scopes = new Set(decodeURIComponent(authRequest.data.scope).split(' ') as Scope[]);

  // normalize the previous scopes
  normalizeScopes(previousScope);

  // if `include_granted_scopes` is set, add all previous scopes to the current scopes
  if (authRequest.data.include_granted_scopes) {
    previousScope.forEach((scope) => scopes.add(scope));
  }

  // nomalize the current scopes
  normalizeScopes(scopes);

  const verifiedAccountsOnly = scopes.has(Scope.Accounts_Verified) && authRequest.data.verified_accounts_only === 'true';

  // get new/existing scopes
  const newScopes = Array.from(scopes).filter((scope) => !previousScope.has(scope));
  const oldScopes = Array.from(previousScope).filter((scope) => scopes.has(scope));

  // handle prompt!=consent
  // TODO: is this required? This should already be handled in the OAuth2 entrypoint (/oauth/authorize).
  // All requests getting here should always show the consent screen.
  const allPreviouslyAuthorized = newScopes.length === 0;
  const canImmediateAuthorize = authRequest.type === AuthorizationRequestType.OAuth2 && authRequest.data.prompt !== 'consent';
  let autoAuthorizeState: FormState | undefined;
  if (allPreviouslyAuthorized && canImmediateAuthorize) {
    autoAuthorizeState = await authorizeInternal(id, previousAccountIds, previousAuthorization?.emailId ?? undefined);
  }

  // handle prompt=none
  // TODO: is this required? This should already be handled in the OAuth2 entrypoint (/oauth/authorize).
  // All requestss with prompt=none should already have been aborted there.
  if (!allPreviouslyAuthorized && authRequest.type === AuthorizationRequestType.OAuth2 && authRequest.data.prompt === 'none') {
    await cancelAuthorization(authRequest.id);
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
        _count: { select: { apiTokens: { where: { permissions: { hasEvery: bn2Permissions }}}}},
      },
    })
    : [];

  // bind parameters to authorize action
  const authorizeAction = authorize.bind(null, id);
  const cancelAction = cancelAuthorization.bind(null, id);

  return (
    <>
      <div className="header">
        <ApplicationImage fileId={client.application.imageId} size={64}/>
        <span className="title">{client.application.name}</span>
        <span className="subtitle">{client.application.owner.name}</span>
      </div>
      {!session || !user ? (
        <>
          <p className="intro">To authorize this application, you need to log in first.</p>
          <LoginForm returnTo={selfUrl}/>
          <form action={cancelAction} className="flex">
            <SubmitButton flex appearance="tertiary" className="button">Cancel</SubmitButton>
          </form>
        </>
      ) : (
        <Form action={authorizeAction} initialState={autoAuthorizeState}>
          <div className="form">
            {newScopes.length === 0 ? (
              <p className="intro">{client.application.name} wants to reauthorize access to your bn2.me account.</p>
            ) : oldScopes.length === 0 ? (
              <p className="intro">{client.application.name} wants to access the following data of your bn2.me account.</p>
            ) : (
              <p className="intro">{client.application.name} wants to access additional data.</p>
            )}

            {newScopes.length > 0 && renderScopes(newScopes, user, emails, previousAuthorization?.emailId ?? user.defaultEmail?.id, authRequest.id)}

            {oldScopes.length > 0 && (
              <Expandable label="Show previously authorized permissions.">
                {renderScopes(oldScopes, user, emails, previousAuthorization?.emailId ?? user.defaultEmail?.id, authRequest.id)}
              </Expandable>
            )}

            {scopes.has(Scope.Accounts) && (
              <div className="-mx-4 p-4 border-y border-(--color-border-dark) bg-(--color-background-light)">
                Select Accounts {verifiedAccountsOnly && '(Verified only)'}
                <div className="w-full flex flex-col mt-4">
                  {accounts.map((account) => (
                    <Checkbox key={account.id} defaultChecked={previousAccountIds.includes(account.id) && (account.verified || !verifiedAccountsOnly)} name="accounts" formValue={account.id} disabled={!account.verified && verifiedAccountsOnly}>
                      <FlexRow>
                        {account.displayName ? <>{account.displayName} <span className="text-muted">({account.accountName})</span></> : account.accountName}
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
                  <LinkButton href={`/authorize/${authRequest.id}/add-account`} appearance="menu" icon="add">Add account</LinkButton>
                </div>
              </div>
            )}

            <p className="text-[15px]">
              The above data will be shared with {client.application.name} in accordance with their
              {' '}{client.application.privacyPolicyUrl ? <ExternalLink href={client.application.privacyPolicyUrl}>privacy policy</ExternalLink> : 'privacy policy'} and
              {' '}{client.application.termsOfServiceUrl ? <ExternalLink href={client.application.termsOfServiceUrl}>terms of service</ExternalLink> : 'terms of service'}.
              You can revoke access at anytime from your <Link href="/profile">bn2.me profile</Link>.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 border-2 border-(--color-border)">
              <Button type="submit" formAction={cancelAction} flex className="justify-center">Cancel</Button>
              <SubmitButton type="submit" flex className="justify-center shadow-[0_0_0_1px] shadow-green-600 bg-green-100 text-green-800">Authorize {client.application.name}</SubmitButton>
            </div>

            {(authRequest.type === 'OAuth2' || authRequest.type === 'OAuth2_PAR') && (
              <div className="leading-5 text-center text-[15px] text-muted">Authorizing will redirect you to <b>{new URL(authRequest.data.redirect_uri).origin}</b></div>
            )}
          </div>
        </Form>
      )}
    </>
  );
}

export async function generateMetadata({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const authRequest = await getPendingAuthorizationRequest(id);

  return {
    title: `Authorize ${authRequest?.client.application.name}`,
  };
}

export interface ScopeItemProps {
  icon: IconProp;
  children: ReactNode;
}

const ScopeItem: FC<ScopeItemProps> = ({ icon, children }) => {
  return <li className="grid [grid-template-columns:16px_auto] gap-3 mt-2 py-1.5 px-4 rounded-xs border leading-normal"><Icon icon={icon} className="mt-1"/><div>{children}</div></li>;
};

function getApplicationGrant(applicationId: string, userId: string) {
  return db.applicationGrant.findUnique({
    where: { userId_applicationId: { userId, applicationId }},
    include: { accounts: { select: { id: true }}},
  });
}

function renderScopes(scopes: Scope[], user: User & { defaultEmail: null | { id: string }}, emails: UserEmail[], emailId: undefined | string, authorizationRequestId: string) {
  return (
    <ul className="m-0 p-0 list-none first:mt-0">
      {scopes.includes(Scope.Identify) && <ScopeItem icon="user">Your username <strong>{user.name}</strong></ScopeItem>}
      {scopes.includes(Scope.Email) && (
        <ScopeItem icon="mail">
          <p className="p">Your email address</p>
          <div className="flex gap-2" style={{ marginBlock: 8 }}>
            {emails.length > 0 && (<Select name="email" options={emails.map(({ id, email }) => ({ label: email, value: id }))} defaultValue={emailId}/>)}
            <LinkButton href={`/authorize/${authorizationRequestId}/add-email`} icon="add">Add Email</LinkButton>
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
      {scopes.includes(Scope.Accounts_Verified) && <ScopeItem icon="verified">Your Guild Wars 2 account verification status</ScopeItem>}
      {hasBn2Scopes(scopes) && (
        <ScopeItem icon="developer">
          <p className="mb-0">Read-only access to the Guild Wars 2 API</p>
          <PermissionList permissions={scopeToPermissions(scopes)}/>
        </ScopeItem>
      )}
    </ul>
  );
}
