'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';
import type { Authorization } from '@bn2me/database';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isString } from '@brickninja-org/helper/is';

import { AuthorizationType } from '@bn2me/database';
import { Scope } from '@bn2me/client';

import { expiresAt } from '@/lib/date';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { generateCode } from '@/lib/token';
import { hasBn2Scopes } from '@/lib/scope';
import { createRedirectUrl } from '@/lib/redirect-url';
import { userCookie } from '@/lib/cookie';
import { getFormDataString } from '@/lib/form-data';

export interface AuthorizeActionParams {
  clientId: string,
  redirect_uri: string,
  scopes: Scope[],
  state?: string,
  codeChallenge?: string
}

// eslint-disable-next-line require-await
export async function authorize(params: AuthorizeActionParams, _: FormState, formData: FormData): Promise<FormState> {
  // get account ids from form
  const accountIds = formData.getAll('accounts').filter(isString);

  // get email id from form
  const emailId = getFormDataString(formData, 'email');

  // get session
  const session = await getSession();

  if(session) {
    // make sure user cookie is set for better login flow later
    const cookieStore = await cookies();
    cookieStore.set(userCookie(session.userId));
  }

  return authorizeInternal(params, accountIds, emailId);
}

export async function authorizeInternal(
  { clientId, redirect_uri, scopes, state, codeChallenge }: AuthorizeActionParams,
  accountIds: string[],
  emailId: string | undefined
) {
  // verify at least one account was selected
  if((hasBn2Scopes(scopes) || scopes.includes(Scope.Accounts)) && accountIds.length === 0) {
    return { error: 'At least one account has to be selected.' };
  }

  // verify email was selected
  if(scopes.includes(Scope.Email) && !emailId) {
    return { error: 'Email has to be selected' };
  }

  // get session and verify
  const session = await getSession();

  if(!session) {
    return { error: 'Not logged in' };
  }

  let authorization: Authorization;

  try {
    const identifier = {
      type: AuthorizationType.Code,
      clientId,
      userId: session.userId
    };

    [, authorization] = await db.$transaction([
      // delete old pending authorization codes for this app
      db.authorization.deleteMany({ where: identifier }),

      // create code authorization in db
      db.authorization.create({
        data: {
          ...identifier,
          scope: scopes,
          redirectUri: redirect_uri,
          codeChallenge,
          token: generateCode(),
          expiresAt: expiresAt(60),
          accounts: { connect: accountIds.map((id) => ({ id })) },
          emailId
        },
      }),
    ]);
  } catch(error) {
    console.log(error);

    return { error: 'Authorization failed' };
  }

  // build redirect url with token and state
  const url = await createRedirectUrl(redirect_uri, {
    state,
    code: authorization.token,
  });

  // redirect back to app
  redirect(url.toString());
}
