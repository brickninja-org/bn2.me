import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Steps } from '@/components/steps/Steps';

export default function DevDocsManageAppsPage() {
  return (
    <PageLayout className="">
      <PageTitle>Manage Applications</PageTitle>

      <Headline id="register">Register your Application</Headline>
      <p>The first step to getting an access token is to register your application.</p>

      <Steps>
        <div>You need to <Link href="/login">Login</Link> to bn2.me.</div>
        <div>Go to the page to <Link href="/dev/applications/create">create a new application</Link>.</div>
        <div>Enter the <b>name</b> of your application. The name must be unique and should tell the user what your application is about. The name is shown to the user when authorizing your Application and on their profile under <Link href="/applications">Authorized Applications</Link>.</div>
        <div>Select the type of your application. See <Link href="#public-confidential">Public vs. Confidential Applications</Link> for the differences. You cannot change this later.</div>
        <div>Click <b>Create Application</b>.</div>
      </Steps>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Manage Applications',
};
