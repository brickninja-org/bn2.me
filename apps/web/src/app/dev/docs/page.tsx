import Link from 'next/link';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { Code } from '@/components/layout/Code';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageTitle } from '@/components/layout/PageTitle';
import { Steps } from '@/components/steps/Steps';

export default function Docs() {
  return (
    <PageLayout className="layout">
      <PageTitle>Documentation</PageTitle>

      <p>bn2.me uses <Link href="https://datatracker.ietf.org/doc/html/rfc6749">OAuth 2.0</Link> to manage the access between users and applications.</p>

      <p>
        This documentation is aimed at developers who want to integrate bn2.me into their applications,
        so their users can use bn2.me to authorize the app to access the Guild Wars 2 API on their behalf.
      </p>

      <Headline id="use">Use bn2.me in your application</Headline>

      <Steps>
        <div><Link href="/dev/docs/manage-apps#register">Register your application</Link>.</div>
        <div><Link href="/dev/docs/access-tokens">Get an access token</Link> by navigating the user to the authorization page.</div>
        <div>
          Access the Rebrickable API by <Link href="/dev/docs/rebrickable-api">generating subtokens</Link> or
          use other <Link href="/dev/docs/api-reference">bn2.me APIs</Link>.
        </div>
      </Steps>

      <p>Most of these steps can be handled by using existing OAuth2 libraries or the bn2.me specific <Link href="/dev/docs/libraries">client libraries</Link>.</p>

      <Headline id="urls">OAuth2 URLs</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Endpoint</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Authorization Server Metadata</td>
            <td><FlexRow><Code inline>https://bn2.me/.well-known/oauth-authorization-server</Code><CopyButton copy="https://bn2.me/.well-known/oauth-authorization-server" icon="copy" iconOnly/></FlexRow></td>
          </tr>
          <tr>
            <td>Base authorization URL</td>
            <td><FlexRow><Code inline>https://bn2.me/oauth2/authorize</Code><CopyButton copy="https://bn2.me/oauth2/authorize" icon="copy" iconOnly/></FlexRow></td>
          </tr>
          <tr>
            <td>Token URL</td>
            <td><FlexRow><Code inline>https://bn2.me/api/token</Code><CopyButton copy="https://bn2.me/api/token" icon="copy" iconOnly/></FlexRow></td>
          </tr>
        </tbody>
      </Table>

      <Headline id="why">Why bn2.me</Headline>

      <p>
        bn2.me provides secure way for users to manage access between multiple Brickset accounts and applications.
      </p>

      <ul>
        <li>User don&apos;t have to handle API keys for every application, instead they just have to <b>setup bn2.me once.</b></li>
        <li>bn2.me generates <b>secure subtokens</b> with the specific scopes requested by the application.</li>
        <li>bn2.me also handles all <b>errors</b> around invalid API keys, so applications always receive valid API keys.</li>
        <li>
          Instead of instructing the user how to generate API keys and which permissions are required,
          applications can instead just include a <b>Login with bn2.me</b> button.
        </li>
        <li>
          Users can review and <b>revoke access</b> to any application at any point, which is often not possible with API keys because
          users tend to reuse the same API key for multiple applications.
        </li>
      </ul>


      <Headline id="support">Support</Headline>

      <p>
        If you have any questions or need help integrating bn2.me into your application, you can use the
        #brickninja channel on <Link href="https://discord.gg/gvx6ZSE">BN2 Development Community Discord server</Link>.
      </p>

      <p>
        If you find any bugs on bn2.me you can report them in
        the <Link href="https://github.com/brickninja-org/bn2.me/issues">GitHub issue tracker</Link>.
      </p>

      <Headline id="contribute">Contribute</Headline>

      <p>
        You can contribute to the development of bn2.me in
        the <Link href="https://github.com/brickninja-orgbn2.me">brickninja-org/bn2.me</Link> repository on github.
      </p>

    </PageLayout>
  );
}

export const metadata = {
  title: 'Developer Documentation',
  description: 'Documentation for integrating bn2.me',
};
