/* eslint-disable @next/next/no-img-element */

import type { FC } from 'react';

import placeholder from './app-placeholder.png';
import { cn } from '@brickninja-org/ui';

export interface ApplicationImageProps {
  fileId: string | null;
  size?: number;
  className?: string;
}

export const ApplicationImage: FC<ApplicationImageProps> = ({ fileId, size = 32, className }) => {
  return (
    <img
      className={cn('[grid-area:icon] rounded-xs w-16 h-16 object-cover', className)}
      src={fileId ? `/api/file/${fileId}` : placeholder.src}
      width={size} height={size}
      alt=""
      crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy"/>
  );
};
