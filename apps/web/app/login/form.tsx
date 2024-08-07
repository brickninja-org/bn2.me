import type { FC } from 'react';
import { cookies } from 'next/headers';
import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { Form } from '@brickninja-org/ui/components/form';
import { Notice } from '@brickninja-org/ui/components/notice';

import { UserProviderType } from '@bn2me/database';

import { LoginErrorCookieName, UserCookieName } from '@/lib/cookie';
import { createVerifier } from '@/lib/jwt';
import { db } from '@/lib/db';
import { providers } from 'app/auth/providers';

import { login, LoginOptions } from './action';
import { NoticeContext } from '@/components/notice-context/notice-context';

interface LoginFormProps {
  returnTo?: string;
}

export const LoginForm: FC<LoginFormProps> = async ({ returnTo }) => {
  const prevUser = await getPreviousUser();

  const options: LoginOptions = {
    returnTo,
    userId: prevUser?.id,
  };

  const availableProviders = Object.fromEntries(Object.entries(providers).map(
    ([provider, config]) => [provider, config !== undefined && (!prevUser || prevUser.providers.some((p) => provider === provider))] as const
  )) as Record<UserProviderType, boolean>;

  const error = getLoginErrorCookieValue();

  return (
    <div>
      <Form action={login.bind(null, 'login', options)}>
        {error === LoginError.Unknown && (<Notice color="error">Unknown error</Notice>)}
        {error === LoginError.WrongUser && (<Notice color="error">The login provider you tried to login with is not linked to your user.<br/>Please login with the login provider you have previously used. You can add additional login providers in your profile after successfully logging in.</Notice>)}
        <NoticeContext>
          {prevUser ? (
            <div className="">
              <FlexRow align="between">
                <span>Login as <strong>{prevUser.name}</strong></span>
                <button type="submit">Login</button>
              </FlexRow>
            </div>
          ) : (
            <Notice color="warning">If you have used bn2.me before, please <b>use the same login provider</b> to access your account. You can add additional providers after login.</Notice>
          )}
        </NoticeContext>

        <div>
          <FlexRow>
            <p>By logging in you accept that bn2.me will store cookies in your browser.</p>
          </FlexRow>
        </div>
      </Form>
    </div>
  )
};

export async function getPreviousUser() {
  const jwt = cookies().get(UserCookieName)?.value;

  if (!jwt) {
    return undefined;
  }

  const verifyJwt = createVerifier();

  let jwtPayload: { sub: string };
  try {
    jwtPayload = verifyJwt(jwt);
  } catch {
    return undefined;
  }

  const user = await db.user.findUnique({
    where: { id: jwtPayload.sub },
    select: {
      id: true,
      name: true,
      providers: {
        distinct: ['provider'],
        select: {
          provider: true,
        },
      },
    },
  });

  return user ?? undefined;
}

export const enum LoginError {
  Unknown,

  /** Tried to login as a specific user but provided a different token */
  WrongUser,
}

export function getLoginErrorCookieValue(): LoginError | undefined {
  const errorCookie = cookies().get(LoginErrorCookieName)?.value;

  if (errorCookie === undefined) {
    return undefined;
  }

  const verifyJwt = createVerifier();

  try {
    const error: { err: LoginError } = verifyJwt(errorCookie);
    return error.err;
  } catch {
    return LoginError.Unknown;
  }
}
