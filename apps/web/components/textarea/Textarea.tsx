import type { FC, ChangeEvent } from 'react';

import { useCallback } from 'react';

export interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  form?: string;
}

export const Textarea: FC<TextareaProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return <textarea className="w-full min-h-[100px] py-2 px-4 rounded-xs border-2 bg-white transition-colors resize-y" onChange={onChange && handleChange} {...props}/>;
};
