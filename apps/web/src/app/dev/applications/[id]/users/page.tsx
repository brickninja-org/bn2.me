import type { Metadata } from 'next';

import Link from 'next/link';
import { Scope } from '@bn2me/client';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { db } from '@/lib/db';
import { getSessionOrRedirect } from '@/lib/session';
import { Code } from '@/components/layout/Code';
import { ColumnSelection } from '@/components/table/ColumnSelection';
import { FormatDate } from '@/components/format/FormatDate';
import { getApplicationById } from '../helper';

const getUsers = (applicationId: string, ownerId: string) => {
  return db.applicationGrant.findMany({
    where: { applicationId, application: { ownerId }, scope: { has: Scope.Identify }},
    include: {
      _count: { select: { accounts: true }},
      user: { select: { name: true }},
      email: { select: { email: true, verified: true }},
      authorizations: {
        take: 1,
        where: { usedAt: { not: null }},
        orderBy: { usedAt: 'desc' },
        select: { usedAt: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export default async function ApplicationUsersPage({ params }: PageProps<'/dev/applications/[id]/users'>) {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);
  const users = await getUsers(id, session.userId);

  if (users.length === 0) {
    return (
      <>
        <p>You don&apos;t have any users yet or none of your users have the <Code inline>{Scope.Identify}</Code> scope.</p>
        {!application.public && (
          <p>Go to <Link href={`/dev/applications/${id}`}>Settings</Link> and make you application public so users can discover it on the <Link href="/discover">Discover</Link> page.</p>
        )}
      </>
    );
  }

  const getEmail = (user: typeof users[number]): typeof users[number]['email'] =>
    user.scope.includes(Scope.Email) ? user.email : null;

  const anyHasMail = users.some(getEmail);

  const Users = createDataTable(users, ({ id }) => id);

  return (
    <>
      <FlexRow align="between">
        <div>
          <p>This page lists all your users that have the <Code inline>{Scope.Identify}</Code> scope.</p>
        </div>
        <ColumnSelection table={Users}/>
      </FlexRow>

      <div className="mt-8"/>

      <Users.Table>
        <Users.Column id="id" title="ID" hidden>{({ userId }) => <Code inline borderless>{userId}</Code>}</Users.Column>
        <Users.Column id="user" title="User" sortBy={({ user }) => user.name}>{({ user }) => user.name}</Users.Column>
        <Users.Column id="scope" title="Scopes" sortBy={({ scope }) => scope.length}>{({ scope }) => scope.join(' ')}</Users.Column>
        <Users.Column id="email" title="Email" sortBy={(user) => getEmail(user)?.email} hidden={!anyHasMail}>{(user) => getEmail(user)?.email}</Users.Column>
        <Users.Column id="accounts" title="Accounts" sortBy={({ _count }) => _count.accounts} align="end">{({ _count }) => _count.accounts}</Users.Column>
        <Users.Column id="usedAt" title="Last Used" sortBy={({ authorizations }) => authorizations[0]?.usedAt}>{({ authorizations }) => authorizations[0]?.usedAt ? <FormatDate date={authorizations[0]?.usedAt}/> : null}</Users.Column>
        <Users.Column id="createdAt" title="Created At" sortBy={({ createdAt }) => createdAt}>{({ createdAt }) => <FormatDate date={createdAt}/>}</Users.Column>
      </Users.Table>
    </>
  );
}

export async function generateMetadata({ params }: PageProps<'/dev/applications/[id]/users'>): Promise<Metadata> {
  const { id } = await params;
  const session = await getSessionOrRedirect();
  const application = await getApplicationById(id, session.userId);

  return {
    title: `${application.name} / Users`,
  };
}
