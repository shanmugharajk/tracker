'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '~/components/ui/badge';
import { DataTable } from '~/components/ui/data-table';
import { formatCurrency } from '~/lib/formatters/currency';
import { formatDateTimeParts } from '~/lib/formatters/date-time';
import type { ExpenseRecord } from '~/server/services/ledger';

type AllExpensesTableProps = {
  data: ExpenseRecord[];
  timeZone: string;
};

function createAllExpensesColumns(
  timeZone: string
): ColumnDef<ExpenseRecord>[] {
  return [
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const expense = row.original;
        const tags = expense.tags?.trim();

        return (
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1">
            <div className="inline-flex items-center gap-1.5">
              <span className="font-medium text-[13px] text-foreground sm:text-sm">
                {expense.category}
              </span>
            </div>
            {tags ? (
              <Badge
                variant="secondary"
                className="h-5 self-start rounded-full px-2 py-0 text-[10px] font-medium leading-none tracking-wide sm:text-xs"
              >
                {tags}
              </Badge>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      meta: { align: 'right' },
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-foreground">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: 'paidByUserName',
      header: 'Paid By',
      cell: ({ row }) => (
        <span className="text-foreground">
          {row.original.paidByUserName ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        const { datePart, timePart } = formatDateTimeParts(
          row.original.createdAt,
          timeZone
        );

        return (
          <span className="whitespace-nowrap text-foreground">
            {datePart} <span className="text-muted-foreground">{timePart}</span>
          </span>
        );
      },
    },
  ];
}

export function AllExpensesTable({ data, timeZone }: AllExpensesTableProps) {
  const columns = useMemo(() => createAllExpensesColumns(timeZone), [timeZone]);

  return <DataTable columns={columns} data={data} />;
}
