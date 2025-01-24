import { redirect } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';

import { bn2me } from '@/lib/client';
import { PageProps } from '@/lib/next';

export const dynamic = 'force-dynamic';

async function refreshTokenAction(data: FormData) {
  'use server';

  const refresh_token = data.get('refresh_token')?.toString();

  if (!refresh_token) {
    throw new Error();
  }

  const token = await bn2me.refreshToken({ refresh_token });

  redirect(`/token?access_token=${token.access_token}&refresh_token=${token.refresh_token}`);
}

async function revokeAccessToken(data: FormData) {
  'use server';

  const access_token = data.get('access_token')?.toString();
  const refresh_token = data.get('refresh_token')?.toString();

  if (refresh_token) {
    await bn2me.revokeToken({ token: refresh_token });
  }

  redirect(`/token?access_token=${access_token}`);
}

async function revokeRefreshToken(data: FormData) {
  'use server';

  const access_token = data.get('access_token')?.toString();
  const refresh_token = data.get('refresh_token')?.toString();

  if (refresh_token) {
    await bn2me.revokeToken({ token: refresh_token });
  }

  redirect(`/token?access_token=${access_token}`);
}

async function getSubToken(accountId: string, data: FormData) {
  'use server';

  const access_token = data.get('access_token')?.toString();

  if (!access_token) {
    throw new Error('Missing access_token');
  }

  const { subtoken } = await bn2me.api(access_token).subtoken(accountId);

  redirect(`https://brickset.com/api/v3.asmx?checkUserHash=${subtoken}`);
}

export default async function TokenPage({ searchParams: asyncSearchParams }: PageProps) {
  const searchParams = await asyncSearchParams;

  const access_token = Array.isArray(searchParams.access_token) ? searchParams.access_token[0] : searchParams.access_token;
  const refresh_token = Array.isArray(searchParams.refresh_token) ? searchParams.refresh_token[0] : searchParams.refresh_token;

  const api = access_token ? bn2me.api(access_token) : undefined;

  const [user, accounts, introspectAccessToken, introspectRefreshToken] = await Promise.all([
    api?.user().catch((e) => String(e)),
    api?.accounts().catch((e) => String(e)),
    bn2me.introspectToken({ token: access_token! }).catch((e) => String(e)),
    bn2me.introspectToken({ token: refresh_token! }).catch((e) => String(e)),
  ]);

  return (
    <form>
      <Label label="access_token">
        <TextInput value={access_token} name="access_token" readOnly/>
      </Label>
      <Label label="refresh_token">
        <TextInput value={refresh_token} name="refresh_token" readOnly/>
      </Label>

      <FlexRow>
        <Button icon={undefined /* "revision" */} type="submit" formAction={refreshTokenAction} disabled={!refresh_token}>Refresh Token</Button>
        <Button icon="delete" type="submit" formAction={revokeAccessToken} disabled={!access_token}>Revoke access_token</Button>
        <Button icon="delete" type="submit" formAction={revokeRefreshToken} disabled={!refresh_token}>Revoke refresh_token</Button>
      </FlexRow>
      <br/>

      <div>
        <b>/api/user</b>
        <pre className="my-4">{JSON.stringify(user, undefined, '  ')}</pre>
        <b>/api/accounts</b>
        <pre className="my-4">{JSON.stringify(accounts, undefined, '  ')}</pre>
        <b>/api/token/introspect</b> (access_token)
        <pre className="my-4">{JSON.stringify(introspectAccessToken, undefined, '  ')}</pre>
        <b>/api/token/introspect</b> (refresh_token)
        <pre className="my-4">{JSON.stringify(introspectRefreshToken, undefined, '  ')}</pre>
      </div>

      <FlexRow>
        {typeof accounts === 'object' && accounts?.accounts?.map((account) => (
          <Button key={account.id} icon="key" type="submit" formAction={getSubToken.bind(null, account.id)}>Get Subtoken{account.name}</Button>
        ))}
      </FlexRow>
    </form>
  );
}

export const metadata = {
  title: 'Token',
};
