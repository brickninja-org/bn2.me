'use client';

import { Notice, type NoticeProps } from '@brickninja-org/ui/components/notice';
import { type FC, type ReactNode, createContext, useContext, useMemo, useState } from 'react';

export interface NoticeContext {
  show: (notice: NoticeProps | null) => void
}

const context = createContext<NoticeContext>({ show: () => {} });

interface NoticeContextProps {
  children: ReactNode;
};

export const NoticeContext: FC<NoticeContextProps> = ({ children }) => {
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
