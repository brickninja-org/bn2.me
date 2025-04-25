import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { bn2me, createDPoPJwt, getCallback, getPKCEPair } from '@/lib/client';
import { nextSearchParamsToURLSearchParams, PageProps, SearchParams } from '@/lib/next';
import { TokenResponse } from '@bn2me/client';

export const dynamic = 'force-dynamic';

async function getToken(code: string, isDPoP: boolean) {
  const { code_verifier } = await getPKCEPair();

  return bn2me.getAccessToken({
    code,
    token_type: isDPoP ? 'DPoP' : 'Bearer',
    code_verifier,
    redirect_uri: getCallback(isDPoP),
    dpop: isDPoP ? createDPoPJwt : undefined,
  });
}

export default async function CallbackPage({ searchParams }: PageProps) {
  const data = await parseSearchParams(await searchParams);

  return (
    <main className="container mx-auto max-w-7xl mb-8 px-6 grow">
      <div>
        <pre>{JSON.stringify(data, undefined, '  ')}</pre>

        {!('access_token' in data) ? (
          <LinkButton href="/">Back</LinkButton>
        ) : (
          <LinkButton href={`/token?access_token=${data.access_token}&refresh_token=${data.refresh_token}&token_type=${data.token_type}`} external>Continue</LinkButton>
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: 'OAuth2 Callback',
};

async function parseSearchParams(searchParams: SearchParams): Promise<TokenResponse | { error: string }> {
  const params = nextSearchParamsToURLSearchParams(searchParams);

  try {
    const { code } = bn2me.parseAuthorizationResponseSearchParams(params);

    return await getToken(code, params.has('dpop'));
  } catch (e) {
    return { error: String(e) };
  }
}
