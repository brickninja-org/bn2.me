import { FC, ReactNode } from 'react';

import { Source_Code_Pro } from 'next/font/google';
import { tv } from 'tailwind-variants';

import { cn } from '@brickninja-org/ui';

interface CodeProps {
  children: ReactNode;
  borderless?: boolean;
  inline?: boolean;
}

const font = Source_Code_Pro({
  subsets: ['latin'],
  weight: 'variable',
  fallback: ['monospace'],
});

const code = tv({
  base: 'text-sm',
  variants: {
    borderless: {
      true: '',
    },
    inline: {
      true: ''
    },
  },
  defaultVariants: {
    borderless: false,
    inline: false,
  },
  compoundVariants: [
    { borderless: false, inline: true, class: 'px-1 rounded-sm border border-gray-200 bg-gray-100' }, // inlineBorder
    { borderless: true, inline: true, class: '' }, // inline
    { borderless: true, inline: false, class: 'my-4 overflow-x-auto' }, // code
    { borderless: false, inline: false, class: 'my-4 -ml-4 p-4 rounded-e-sm border border-l-0 border-gray-200 bg-gray-100 overflow-x-auto' }, // codeBorder
  ],
});

export const Code: FC<CodeProps> = ({ children, borderless = false, inline = false }) => {
  if(inline) {
    return (
      <code className={cn(code({ borderless, inline }), font.className)}>{children}</code>
    );
  }

  return (
    <pre className={cn(code({ borderless }), font.className)}><code>{children}</code></pre>
  );
};
