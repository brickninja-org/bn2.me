import 'server-only';

import { unstable_noStore } from 'next/cache';

import { Bn2MeClient } from '@bn2me/client';
import { generatePKCEPair, type PKCEPair } from '@bn2me/client/pkce';

const globalForPKCE = globalThis as unknown as { pkce: PKCEPair | undefined };

// generate PKCE pair on first invocation
// otherwise return cached PKCE pair because we don't store it
// reusing a PKCE pair is against the spec, but this is just a demo
// DO NOT DO IT LIKE THIS IN A REAL-WORLD APPLICATION
export async function getPKCEPair() {
  if(!globalForPKCE.pkce) {
    globalForPKCE.pkce = await generatePKCEPair();
  }

  return globalForPKCE.pkce;
}

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

export function getCallback() {
  unstable_noStore();
  return process.env.CALLBACK_URL ?? 'https://demo.bn2.me/callback';
}
