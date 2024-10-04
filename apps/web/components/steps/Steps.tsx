import { Children, type FC, type ReactNode } from 'react';

export interface StepsProps {
  children: ReactNode[]
}

export const Steps: FC<StepsProps> = ({ children }) => {
  return (
    <ol className="mb-[1.5em] [counter-reset:steps]">
      {Children.map(children, (child, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={index} className="relative py-2 pl-[40px] before:[counter-increment:steps] before:content-[counter(steps)] before:absolute before:t-[7px] before:left-0 before:flex before:items-center before:justify-center before:w-6 before:h-6 before:border before:rounded-full before:border-gray-300">{child}</li>
      ))}
    </ol>
  );
};
