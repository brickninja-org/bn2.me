import type { FC, ReactNode } from 'react';
import type { DataTableColumnSelectionProps } from '@brickninja-org/ui/components/table/DataTable';

export interface ColumnSelectionProps {
  table: { ColumnSelection: FC<DataTableColumnSelectionProps> },
  children?: ReactNode,
}

export const ColumnSelection: FC<ColumnSelectionProps> = ({ table: { ColumnSelection }, children }) => {
  return (
    <ColumnSelection reset="Reset columns">{children ?? 'Columns'}</ColumnSelection>
  );
};
