'use client';

import type { AnchorHTMLAttributes, FC } from 'react';
import type { ButtonVariants } from '@heroui/react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { IconProp } from '@brickninja-org/ui';

import Link from 'next/link';
import { buttonVariants } from '@heroui/react';
import { Icon } from '@brickninja-org/ui';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>, RefProp<HTMLAnchorElement>, ButtonVariants {
  href: string,
  icon?: IconProp,
  isExternal?: boolean,
  prefetch?: boolean,
}

const LinkButton: FC<LinkButtonProps> = ({ ref, href, variant = 'secondary', icon, isExternal, className, children, ...props }) => {
  const LinkElement = isExternal ? 'a' : Link;

  return (
    <LinkElement ref={ref} href={href} className={buttonVariants({ variant, className })} {...props}>
      {icon && <Icon icon={icon} className="w-5 h-5"/>}
      {children}
    </LinkElement>
  );
};

LinkButton.displayName = 'BrickCatalog.LinkButton';

export type { LinkButtonProps };
export { LinkButton };
