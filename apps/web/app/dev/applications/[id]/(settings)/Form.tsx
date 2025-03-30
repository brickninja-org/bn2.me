'use client';

import type { FC } from 'react';
import type { SelectProps } from '@brickninja-org/ui/components/form/Select';

import { useActionState, useCallback } from 'react';
import Link from 'next/link';

import { Application, UserEmail } from '@bn2me/database';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { Select } from '@brickninja-org/ui/components/form/Select';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { Textarea } from '@/components/textarea/Textarea';


export interface ApplicationFormProps {
  applicationId: string;
  application: Application;
  emails: UserEmail[];
  editApplicationAction: (state: FormState, data: FormData) => Promise<FormState>;
}

export const ApplicationForm: FC<ApplicationFormProps> = ({ applicationId, application, emails, editApplicationAction }) => {
  const [editState, editAction, isPending] = useActionState(editApplicationAction, {}, `/dev/applications/${applicationId}`);
  const emailOptions: SelectProps['options'] = emails.map((email) => ({ value: email.id, label: email.email }));

  const showNotice = useCallback((notice: HTMLElement | null) => {
    if(!isPending) {
      notice?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isPending]);

  return (
    <>
      <form id="edit" action={editAction}>
        {editState.success && <Notice ref={showNotice} key={crypto.randomUUID()}>{editState.success}</Notice>}
        {editState.error && <Notice type="error" ref={showNotice} key={crypto.randomUUID()}>{editState.error}</Notice>}

        <div className="flex flex-col gap-4">
          <Label label="Image">
            <FlexRow>
              <input type="file" name="image"/>
            </FlexRow>
          </Label>

          <Label label="Name">
            <TextInput name="name" defaultValue={application.name} value={undefined} readOnly={isPending}/>
          </Label>

          <Label label="Description">
            <Textarea name="description" defaultValue={application.description} readOnly={isPending}/>
          </Label>

          <Label label="Contact Email">
            {null}
            <Select name="email" options={[{ label: '', value: '' }, ...emailOptions]} defaultValue={application.emailId ?? undefined}/>
          </Label>

          <Label label="Public">
            <Checkbox name="public" defaultChecked={application.public} disabled={isPending}>
              Show on <Link href="/discover">Discover</Link> page
            </Checkbox>
          </Label>

          <Label label="Public URL">
            <TextInput name="publicUrl" defaultValue={application.publicUrl} value={undefined} readOnly={isPending}/>
          </Label>

          <Label label="Privacy Policy URL">
            <TextInput name="privacyPolicyUrl" defaultValue={application.privacyPolicyUrl} value={undefined} readOnly={isPending}/>
          </Label>

          <Label label="Terms of Service URL">
            <TextInput name="termsOfServiceUrl" defaultValue={application.termsOfServiceUrl} value={undefined} readOnly={isPending}/>
          </Label>
        </div>
      </form>

      <FlexRow wrap>
        <Button type="submit" form="edit" disabled={isPending} icon={isPending ? 'loading' : undefined}>Save</Button>
        <LinkButton href={`/dev/applications/${application.id}/delete`} icon="delete" className="text-error">Delete Application</LinkButton>
      </FlexRow>
    </>
  );
};
