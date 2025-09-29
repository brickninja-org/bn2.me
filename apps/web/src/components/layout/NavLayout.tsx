import type { FC, ReactNode } from 'react';

export interface NavLayoutProps {
  content: ReactNode,
  children: ReactNode,
}

export const NavLayout: FC<NavLayoutProps> = ({ content, children }) => {
  return (
    <div className="flex flex-1 mx-auto w-full max-w-[1400px]">
      <aside className="w-1/5 max-w-60 border-r">
        <div className="sticky top-12 flex flex-col gap-2 p-4">
          {children}
        </div>
      </aside>
      {content}
    </div>
  );
};

export const ActiveButtonClass = 'relative before:block before:absolute before:w-1 before:bg-red-700 before:h-8 before:-ml-4 before:rounded-2';
