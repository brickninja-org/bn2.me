import { redirect } from 'next/navigation';

import { Scope } from '@bn2me/client';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select } from '@brickninja-org/ui/components/form/Select';

import { getCallback, getPKCEPair, bn2me } from '@/lib/client';

export default function HomePage() {
  return (
    <form action={login}>
      <div className="w-full flex flex-col gap-4 mb-8">
        <Label label="Scopes">
          <div className="w-full flex flex-col">
            {Object.values(Scope).map((scope) => (
              <Checkbox key={scope} name="scopes" formValue={scope} defaultChecked={[Scope.Identify, Scope.Email].includes(scope)}>{scope}</Checkbox>
            ))}
          </div>
        </Label>

        <Label label="Prompt">
          <Select name="prompt" options={[{ value: '', label: 'Default' }, { value: 'none', label: 'Prompt: None' }, { value: 'consent', label: 'Prompt: Consent' }]}/>
        </Label>

        <Label label="Options">
          <div className="w-full flex flex-col">
            <Checkbox name="include_granted_scopes" formValue="true">include_granted_scopes</Checkbox>
            <Checkbox name="verified_accounts_only" formValue="true">verified_accounts_only</Checkbox>
            <Checkbox name="par" formValue="true">Use Pushed Authorization Request (PAR)</Checkbox>
          </div>
        </Label>
      </div>

      <SubmitButton>Login with bn2.me</SubmitButton>

    </form>
  );
}

export const metadata = {
  title: 'bn2.me Demo'
};

async function login(formData: FormData) {
  'use server';

  const scopes = formData.getAll('scopes') as Scope[];
  const prompt = (formData.get('prompt') || undefined) as 'consent' | 'none' | undefined;
  const include_granted_scopes = formData.get('include_granted_scopes') === 'true';
  const verified_accounts_only = formData.get('verified_accounts_only') === 'true';

  const { challenge } = await getPKCEPair();

  const authUrl = bn2me.getAuthorizationUrl({
    redirect_uri: getCallback(),
    scopes,
    state: 'example',
    ...challenge,
    prompt,
    include_granted_scopes,
    verified_accounts_only,
  });

  redirect(authUrl);
}
