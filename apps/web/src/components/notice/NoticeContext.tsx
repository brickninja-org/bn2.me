'use client';

import type { FC, PropsWithChildren } from 'react';
import type { NoticeProps } from '@brickninja-org/ui/components/notice/Notice';

import { createContext, useContext, useMemo, useState } from 'react';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

export interface NoticeContext {
  show: (notice: NoticeProps | null) => void,
}

const context = createContext<NoticeContext>({ show: () => {} });

export const NoticeContext: FC<PropsWithChildren> = ({ children }) => {
  const [notice, setNotice] = useState<NoticeProps | null>(null);

  // memoize context value to prevent rerenders
  const value = useMemo(() => ({ show: setNotice }), [setNotice]);

  return (
    <context.Provider value={value}>
      {notice && <Notice {...notice}/>}
      {children}
    </context.Provider>
  );
};

export function useShowNotice() {
  return useContext(context);
}
