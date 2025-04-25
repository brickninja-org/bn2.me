import type { FC } from 'react';
import type { LoginOptions } from './action';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { UserProviderType } from '@bn2me/database';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { LoginErrorCookieName, UserCookieName } from '@/lib/cookie';
import { db } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';
import { NoticeContext } from '@/components/notice/NoticeContext';
import { PasskeyAuthenticationButton } from '@/components/passkey/PasskeyAuthenticationButton';

import { providers } from 'app/auth/providers';
import { GitHubIcon } from 'app/auth/github';
import { GoogleIcon } from 'app/auth/google';
import { login } from './action';
import { DevLogin } from './dev-login';
import { Icon } from '@brickninja-org/ui';

interface LoginFormProps {
  returnTo?: string;
}

export const LoginForm: FC<LoginFormProps> = async ({ returnTo }) => {
  const prevUser = await getPreviousUser();

  const options: LoginOptions = {
    returnTo,
    userId: prevUser?.id,
  };

  const availableProviders = Object.fromEntries(Object.entries({ ...providers, [UserProviderType.passkey]: true }).map(
    ([provider, config]) => [provider, config !== undefined && (!prevUser || prevUser.providers.some((p) => p.provider === provider))] as const
  )) as Record<UserProviderType, boolean>;

  const error = await getLoginErrorCookieValue();

  return (
    <div className="max-w-xl mx-auto">
      <Form action={login.bind(null, 'login', options)}>
        {error === LoginError.Unknown && (<Notice type="error">Unknown error</Notice>)}
        {error === LoginError.WrongUser && (<Notice type="error">The login provider you tried to login with is not linked to your user.<br/>Please login with the login provider you have previously used. You can add additional login providers in your profile after successfully logging in.</Notice>)}
        <NoticeContext>
          {prevUser ? (
            <div className="mb-4">
              <FlexRow align="between">
                <span>Login as <b>{prevUser.name}</b></span>
                <Button type="submit" formAction={switchUser}>Not you?</Button>
              </FlexRow>
            </div>
          ) : (
            <Notice type="warning">If you have used bn2.me before, please <b>use the same login provider</b> to access your account. You can add additional providers after login.</Notice>
          )}

          <div className="max-w-xl flex flex-col gap-2">
            {availableProviders[UserProviderType.passkey] && <PasskeyAuthenticationButton className="justify-center" options={options}/>}
            {availableProviders[UserProviderType.google] && (<Button className="justify-center" type="submit" name="provider" value="google" icon={<GoogleIcon/>}>Login with Google</Button>)}
            {availableProviders[UserProviderType.github] && (<Button className="justify-center" type="submit" name="provider" value="github" icon={<GitHubIcon/>}>Login with GitHub</Button>)}
            {process.env.NODE_ENV !== 'production' && (<DevLogin username={prevUser?.name}/>)}
          </div>
        </NoticeContext>

        <div className="mt-4 py-3 px-4 border rounded-xs">
          <FlexRow>
            <Icon icon="cookie"/>
            <p>By logging in you accept that bn2.me will store cookies in your browser.</p>
          </FlexRow>
        </div>
      </Form>
    </div>
  );
};

export async function getPreviousUser() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(UserCookieName)?.value;

  if(!jwt) {
    return undefined;
  }

  let jwtPayload: { sub: string };
  try {
    jwtPayload = await verifyJwt(jwt, { requiredClaims: ['sub'] });
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
        select: { provider: true },
      }
    }
  });

  return user ?? undefined;
}
 
async function switchUser() {
  'use server';

  const cookieStore = await cookies();
  cookieStore.delete(UserCookieName);

  revalidatePath('');
}

export const enum LoginError {
  Unknown,

  /** Tried to login as a specific user but provided a different token */
  WrongUser,
}

export async function getLoginErrorCookieValue(): Promise<LoginError | undefined> {
  const cookieStore = await cookies();
  const errorCookie = cookieStore.get(LoginErrorCookieName)?.value;

  if(errorCookie === undefined) {
    return undefined;
  }

  try {
    const error: { err: LoginError } = await verifyJwt(errorCookie, { requiredClaims: ['err'] });
    return error.err;
  } catch {
    return LoginError.Unknown;
  }
}
