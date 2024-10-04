import { FC } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/copy-button';

import { getApiKeyVerificationName } from '@/lib/api-key-verification-name';
import { Code } from '@/components/layout/Code';
import { Steps } from '@/components/steps/Steps';

export interface AccountAddFormProps {
  returnTo?: string;
  requireVerification?: boolean;
}

export const AccountAddForm: FC<AccountAddFormProps> = async ({ requireVerification }) => {
  const apiKeyName = await getApiKeyVerificationName();

  return (
    <form>
      <Steps>
        <div>Visit the Brickset Account Page</div>
        {!requireVerification ? (
          <div>
            Generate a new API key
            <div className="mt-2 text-gray-600">
              <FlexRow wrap>Optional: verify account ownership by using this API key name: <FlexRow><Code inline>{apiKeyName}</Code> <CopyButton copy={apiKeyName} iconOnly icon="copy"/></FlexRow></FlexRow>
            </div>
          </div>
        ) : (
          <div>
            <FlexRow wrap>Generate a new API key with this exact name: <FlexRow><Code inline>{apiKeyName}</Code> <CopyButton copy={apiKeyName} iconOnly icon="copy"/></FlexRow></FlexRow>
            <div className="mt-2 text-gray-600">
              Make sure to create a <b>new</b> API key, don&apos;t rename an existing one.
            </div>
          </div>
        )}
        <div>
          Paste your key into this form
        </div>
      </Steps>
    </form>
  );
};
