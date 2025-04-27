import 'server-only';

import { unstable_noStore } from 'next/cache';

import { Bn2MeClient, DPoPCallback } from '@bn2me/client';
import { createDPoPJwt as _createDPoPJwt, generateDPoPKeyPair } from '@bn2me/client/dpop';
import { generatePKCEPair, type PKCEPair } from '@bn2me/client/pkce';

const globalForPKCEAndDPoP = globalThis as unknown as {
  pkce: PKCEPair | undefined;
  dpop: CryptoKeyPair | undefined;
};

// generate PKCE pair on first invocation
// otherwise return cached PKCE pair because we don't store it
// reusing a PKCE pair is against the spec, but this is just a demo
// DO NOT DO IT LIKE THIS IN A REAL-WORLD APPLICATION
export async function getPKCEPair() {
  if(!globalForPKCEAndDPoP.pkce) {
    globalForPKCEAndDPoP.pkce = await generatePKCEPair();
  }

  return globalForPKCEAndDPoP.pkce;
}

export async function getDPoPPair() {
  if (!globalForPKCEAndDPoP.dpop) {
    globalForPKCEAndDPoP.dpop = await generateDPoPKeyPair();
  }

  return globalForPKCEAndDPoP.dpop;
}

export const createDPoPJwt: DPoPCallback = async (params) => {
  return _createDPoPJwt(params, await getDPoPPair());
};

export const bn2me = new Bn2MeClient({
  client_id: process.env.DEMO_CLIENT_ID!,
  client_secret: process.env.DEMO_CLIENT_SECRET!,
}, {
  url: getBn2MeUrl(),
});

export function getBn2MeUrl() {
  unstable_noStore();
  return process.env.BN2ME_URL ?? 'https://bn2.me';
}

export function getCallback(isDPoP: boolean) {
  unstable_noStore();

  const redirect_uri = new URL(process.env.CALLBACK_URL ?? 'https://demo.bn2.me/callback');

  if (isDPoP) {
    redirect_uri.searchParams.set('dpop', 'true');
  }

  return redirect_uri.toString();
}
