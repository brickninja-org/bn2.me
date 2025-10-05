'use client';

import type { ComponentProps, FC, PropsWithChildren } from 'react';

import { createContext, useContext, useMemo, useState } from 'react';
import { Callout } from 'fumadocs-ui/components/callout';

type InferredCalloutProps = ComponentProps<typeof Callout>;

export interface NoticeContext {
  show: (notice: InferredCalloutProps | null) => void,
}

const context = createContext<NoticeContext>({ show: () => {} });

export const NoticeContext: FC<PropsWithChildren> = ({ children }) => {
  const [notice, setNotice] = useState<InferredCalloutProps | null>(null);

  // memoize context value to prevent rerenders
  const value = useMemo(() => ({ show: setNotice }), [setNotice]);

  return (
    <context.Provider value={value}>
      {notice && <Callout {...notice}/>}
      {children}
    </context.Provider>
  );
};

export function useShowNotice() {
  return useContext(context);
}
