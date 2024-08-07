import type { ReactNode } from 'react';

import './header.css';

interface AuthorizeLayoutProps {
  children: ReactNode;
}

export default function AuthorizeLayout({ children }: AuthorizeLayoutProps) {
  return (
    <div className="flex-1">
      <main className="flex flex-col gap-4 w-full max-w-[560px] my-8 mx-auto p-4 border rounded-sm">
        {children}
      </main>
    </div>
  );
}
