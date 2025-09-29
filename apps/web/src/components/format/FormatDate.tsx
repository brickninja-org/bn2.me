'use client';

import type { FC } from 'react';

import { useEffect, useState } from 'react';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';

interface FormatDateProps {
  date: Date,
}

export const FormatDate: FC<FormatDateProps> = ({ date }) => {
  const [value, setValue] = useState(date.toUTCString());

  useEffect(() => {
    setValue(date.toLocaleString());
  }, [date]);

  return (
    <Tip tip={date.toUTCString()}>
      <time dateTime={date.toISOString()}>
        {value}
      </time>
    </Tip>
  );
};
