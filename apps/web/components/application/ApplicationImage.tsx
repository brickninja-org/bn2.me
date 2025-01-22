/* eslint-disable @next/next/no-img-element */

import type { FC } from 'react';

import placeholder from './app-placeholder.png';

export interface ApplicationImageProps {
  fileId: string | null;
  size?: number;
}

export const ApplicationImage: FC<ApplicationImageProps> = ({ fileId, size = 32 }) => {
  return (
    <img
      className="[grid-area:icon] rounded-xs w-16 h-16 object-cover"
      src={fileId ? `/api/file/${fileId}` : placeholder.src}
      width={size} height={size}
      alt=""
      crossOrigin="anonymous" referrerPolicy="no-referrer" loading="lazy"/>
  );
};
