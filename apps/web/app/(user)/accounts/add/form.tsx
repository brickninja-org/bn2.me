import type { FC } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';

import { getApiKeyVerificationName } from '@/lib/api-key-verification-name';
import { Code } from '@/components/layout/Code';
import { Steps } from '@/components/steps/Steps';

import { addAccount } from './actions';

export interface AccountAddFormProps {
  returnTo?: string;
  requireVerification?: boolean;
}

export const AccountAddForm: FC<AccountAddFormProps> = async ({ returnTo, requireVerification = false }) => {
  const apiKeyName = await getApiKeyVerificationName();

  return (
    <Form action={addAccount.bind(null, returnTo, requireVerification)}>
      <Steps>
        <div>Visit the <ExternalLink href="https://rebrickable.com/api">Rebrickable API Page</ExternalLink></div>
        {!requireVerification ? (
          <div>
            Generate a new API key
            <div className="mt-2 text-gray-600">
              <FlexRow wrap>Optional: verify account ownership by using this API key name: <Code inline>{apiKeyName}</Code></FlexRow>
            </div>
          </div>
        ) : (
          <div>
            <FlexRow wrap>Generate a new API key with this exact name: <Code inline>{apiKeyName}</Code></FlexRow>
            <div className="mt-2 text-gray-600">
              Make sure to create a <b>new</b> API key, don&apos;t rename an existing one.
            </div>
          </div>
        )}
        <div>
          Paste your key into this form
          <div style={{ display: 'flex', marginBlock: 8 }}>
            <TextInput placeholder="API key" name="api-key"/>
          </div>
          <FlexRow>
            {returnTo && (<LinkButton href={returnTo}>Cancel</LinkButton>)}
            <SubmitButton type="submit" icon="add">Add API key</SubmitButton>
          </FlexRow>
          <FlexRow>
            <ul className="mt-4 text-small">
              <li>bn2.me will only be able to read data of your account provided by the official API.</li>
              <li>bn2.me will NOT be able to write any data to your account.</li>
              <li>bn2.me will NOT share your API key with any 3rd party.</li>
              <li>You can remove access at any time by deleting the API key.</li>
            </ul>
          </FlexRow>
        </div>
      </Steps>
    </Form>
  );
};
