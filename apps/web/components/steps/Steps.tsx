import type { FC, ReactNode } from 'react';

import { Children } from 'react';

export interface StepsProps {
  children: ReactNode[]
}

export const Steps: FC<StepsProps> = ({ children }) => {
  return (
    <ol className="mb-[1.5em] [counter-reset:steps]">
      {Children.map(children, (child, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index} className="relative py-2 pl-[40px] before:text-large before:font-semibold before:[counter-increment:steps] before:content-[counter(steps)] before:absolute before:top-2 before:left-0 before:flex before:items-center before:justify-center before:w-[34px] before:h-[34px] before:pb-0.5 before:pl-[1px] before:border-2 before:rounded-full before:border-default-300 before:text-default-300">{child}</li>
      ))}
    </ol>
  );
};
