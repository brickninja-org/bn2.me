'use client';

import type { FC } from 'react';
import type { Client, ClientSecret } from '@bn2me/database';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { useActionState, useCallback } from 'react';
import { Bn2MeClient, Scope } from '@bn2me/client';
import { ClientType } from '@bn2me/database';
import { Icon } from '@brickninja-org/ui';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { useHydrated } from '@/lib/use-hydrated';
import { Textarea } from '@/components/textarea/Textarea';
import { FormatDate } from '@/components/format/FormatDate';

import { GenerateClientSecretFormState } from './_actions/secret';

export interface ApplicationFormProps {
  applicationId: string;
  clients: (Client & { secrets: Pick<ClientSecret, 'id' | 'createdAt' | 'usedAt'>[] })[];
  editApplicationAction: (state: FormState, data: FormData) => Promise<FormState>;
  generateClientSecretAction: (state: GenerateClientSecretFormState, data: FormData) => Promise<GenerateClientSecretFormState>;
  deleteClientSecretAction: (state: FormState, data: FormData) => Promise<FormState>;
}

export const ApplicationForm: FC<ApplicationFormProps> = ({ applicationId, clients, editApplicationAction, generateClientSecretAction, deleteClientSecretAction }) => {
  const client = clients[0];

  const [editState, editAction, isEditPending] = useActionState(editApplicationAction, {}, `/dev/applications/${applicationId}`);
  const [generateSecretState, generateSecretAction, isGenerateSecretPending] = useActionState(generateClientSecretAction, {}, `/dev/applications/${applicationId}`);
  const [deleteSecretState, deleteSecretAction, isDeleteSecretPending] = useActionState(deleteClientSecretAction, {}, `/dev/applications/${applicationId}`);

  const isPending = isEditPending || isGenerateSecretPending || isDeleteSecretPending;

  const isHydrated = useHydrated();

  const showNotice = useCallback((notice: HTMLElement | null) => {
    if (!isPending) {
      notice?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isPending]);

  return (
    <>
      <form id="edit" action={editAction}>
        {editState.success && <Notice ref={showNotice} key={crypto.randomUUID()}>{editState.success}</Notice>}
        {editState.error && <Notice type="error" ref={showNotice} key={crypto.randomUUID()}>{editState.error}</Notice>}
      </form>

      <div className="flex flex-col gap-4">
        <Label label="Type">
          <TextInput readOnly value={client.type}/>
        </Label>

        <Label label="Client ID">
          <TextInput readOnly value={client.id}/>
          {isHydrated && <CopyButton copy={client.id} icon="copy">Copy</CopyButton>}
        </Label>

        {client.type === ClientType.Confidential && (
          <>
            <FlexRow align="between">
              <div>Client Secret</div>
              <form action={generateSecretAction}>
                <SubmitButton disabled={isPending || client.secrets.length >= 10} icon="add" name="clientId" value={client.id}>Generate Client Secret</SubmitButton>
              </form>
            </FlexRow>

            {generateSecretState.success && <Notice ref={showNotice} key={crypto.randomUUID()}>{generateSecretState.success}</Notice>}
            {generateSecretState.error && <Notice type="error" ref={showNotice} key={crypto.randomUUID()}>{generateSecretState.error}</Notice>}
            {deleteSecretState.success && <Notice ref={showNotice} key={crypto.randomUUID()}>{deleteSecretState.success}</Notice>}
            {deleteSecretState.error && <Notice type="error" ref={showNotice} key={crypto.randomUUID()}>{deleteSecretState.error}</Notice>}

            {client.secrets.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Table.HeaderCell>Client Secret</Table.HeaderCell>
                    <Table.HeaderCell small>Last used At</Table.HeaderCell>
                    <Table.HeaderCell small>Actions</Table.HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {client.secrets.map((secret) => (
                    <tr key={secret.id} style={secret.id === generateSecretState.clientSecret?.id ? { background: 'var(--color-green-200)' } : undefined}>
                      {secret.id === generateSecretState.clientSecret?.id ? (
                        <td><FlexRow><Icon icon="key"/><TextInput readOnly value={generateSecretState.clientSecret.secret}/>{isHydrated && <CopyButton copy={generateSecretState.clientSecret.secret} icon="copy">Copy</CopyButton>}</FlexRow></td>
                      ) : (
                        <td><FlexRow><Icon icon="key"/><span>Generated at <FormatDate date={secret.createdAt}/></span></FlexRow></td>
                      )}
                      <td className="nowrap">{secret.usedAt ? <FormatDate date={secret.usedAt}/> : 'never'}</td>
                      <td>
                        <form action={deleteSecretAction}>
                          <SubmitButton className="text-red-600" disabled={isPending || client.secrets.length === 1} icon="delete" name="clientSecretId" value={secret.id}>Delete</SubmitButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div style={{ background: 'var(--color-background-light)', padding: 16, borderRadius: 2, textAlign: 'center', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-dark)' }}>No client secrets added yet</div>
            )}
          </>
        )}

        <Label label="Redirect URLs">
          <Textarea name="callbackUrls" defaultValue={client.callbackUrls.join('\n')} form="edit"/>
        </Label>
      </div>

      <FlexRow wrap>
        <Button type="submit" form="edit" disabled={isPending} icon={isEditPending ? 'loading' : undefined}>Save</Button>
        <LinkButton target="_blank" href={new Bn2MeClient({ client_id: client.id }, { url: 'http://placeholder/' }).getAuthorizationUrl({ redirect_uri: client.callbackUrls[0], scopes: [Scope.Identify], prompt: 'consent', include_granted_scopes: true }).replace('http://placeholder/', '/')}>Test Link <Icon icon="arrow-up-right"/></LinkButton>
      </FlexRow>
    </>
  );
};
