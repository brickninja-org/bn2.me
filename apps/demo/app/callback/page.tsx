import { LinkButton } from '@brickninja-org/ui/components/form/Button';

import { bn2me, getCallback, getPKCEPair } from '@/lib/client';
import { nextSearchParamsToURLSearchParams, PageProps, SearchParams } from '@/lib/next';

export const dynamic = 'force-dynamic';

async function getToken(code: string) {
  const { code_verifier } = await getPKCEPair();

  return bn2me.getAccessToken({
    code,
    code_verifier,
    redirect_uri: getCallback(),
  });
}

export default async function CallbackPage({ searchParams }: PageProps) {
  const data = await parseSearchParams(await searchParams);

  return (
    <main className="container mx-auto max-w-7xl mb-8 px-6 grow">
      <div>
        <pre className="mb-4">{JSON.stringify(data, undefined, '  ')}</pre>

        {!('access_token' in data) ? (
          <LinkButton href="/">Back</LinkButton>
        ) : (
          <LinkButton href={`/token?access_token=${data.access_token}&refresh_token=${data.refresh_token}`}>Continue</LinkButton>
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: 'OAuth2 Callback',
};

async function parseSearchParams(searchParams: SearchParams) {
  const params = nextSearchParamsToURLSearchParams(searchParams);

  try {
    const { code } = bn2me.parseAuthorizationResponseSearchParams(params);

    return await getToken(code);
  } catch (e) {
    return { error: String(e) };
  }
}
