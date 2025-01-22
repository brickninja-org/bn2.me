import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { getBn2MeUrl } from '@/lib/client';

import { FedCm } from './FedCm';

export default function FedCmPage() {
  return (
    <main className="container mx-auto max-w-7xl mb-8 px-6 grow">
      <Headline id="fedcm">Federated Credential Management (FedCM)</Headline>

      <p>This page is a demo to try FedCM. You can read more about FedCM in the <Link href={new URL('/dev/docs/fed-cm', getBn2MeUrl()).toString()}>FedCM Develper Documentation</Link>.</p>

      <FedCm clientId={process.env.DEMO_CLIENT_ID!} bn2meUrl={getBn2MeUrl()}/>
    </main>
  );
}
