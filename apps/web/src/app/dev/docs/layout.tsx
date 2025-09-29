import type { LayoutProps } from '@/lib/next';

import { Separator } from '@brickninja-org/ui/components/layout/Separator';

import { NavLayout } from '@/components/layout/NavLayout';
import { Navigation } from '@/components/layout/Navigation';

export default function DevLayout({ children }: LayoutProps) {
  return (
    <NavLayout content={children}>
      <Navigation prefix="/dev/" items={[
        { segment: ['docs'], label: 'Documentation' },
        { segment: ['docs', 'manage-apps'], label: 'Manage Applications' },
        { segment: ['docs', 'access-tokens'], label: 'Getting Access Tokens' },
        { segment: ['docs', 'refresh-tokens'], label: 'Refreshing Tokens' },
        { segment: ['docs', 'bn2-api'], label: 'Brickset API' },
        { segment: ['docs', 'scopes'], label: 'Scopes' },
        { segment: ['docs', 'fed-cm'], label: 'FedCM API' },
        { segment: ['docs', 'best-practices'], label: 'Best Practices' },
        { segment: ['docs', 'branding'], label: 'Branding' },
        { segment: ['docs', 'api-reference'], label: 'API Reference' },
        { segment: ['docs', 'libraries'], label: 'Client Libraries' },
      ]}/>
      <Separator/>
      <Navigation prefix="/dev/" items={[
        { segment: 'applications', icon: 'apps', label: 'Your Applications' },
      ]}/>
    </NavLayout>
  );
}
