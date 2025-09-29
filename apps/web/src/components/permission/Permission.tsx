'use client';

import type { FC } from 'react';
import { Chip, Tooltip } from '@heroui/react';

export interface PermissionProps {
  permission: string,
}

const descriptions: Record<string, string> = {
  account: 'Your account display name, ID, home world, and list of guilds.',
  inventories: 'Your account bank, material storage, recipe unlocks, and character inventories.',
  characters: 'Basic information about your characters.',
  tradingpost: 'Your Trading Post transactions.',
  wallet: 'Your account\'s wallet.',
  unlocks: 'Your wardrobe unlocks—skins, dyes, minipets, finishers, etc.—and currently equipped skins.',
  pvp: 'Your PvP stats, match history, reward track progression, and custom arena details.',
  wvw: 'Your selected WvW guild, assigned team, and personal WvW information.',
  builds: 'Your currently equipped specializations, traits, skills, and equipment for all game modes.',
  progression: 'Your achievements, dungeon unlock status, mastery point assignments, and general PvE progress.',
  guilds: 'Guilds\' rosters, history, and MOTDs for all guilds you are a member of.',
};

export const Permission: FC<PermissionProps> = ({ permission }) => {
  const description = descriptions[permission];

  if(!description) {
    return <Chip variant="secondary">{permission}</Chip>;
  }

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger aria-label="Permission description">
        <Chip variant="secondary">{permission}</Chip>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow/>
        {description}
      </Tooltip.Content>
    </Tooltip>
  );
};
