'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { MonthYearFilter } from '~/components/ui/month-year-filter';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { formatCurrency } from '~/lib/formatters/currency';
import { formatMonth, type Month } from '~/lib/formatters/date';
import { cn } from '~/lib/cn';
import type { ExpenseSummary, SettlementCopy } from '~/server/services/ledger';

import { DashboardMetricsSkeleton } from './dashboard-card-skeleton';
import { SettlementForm } from './settlement-form';

type DashboardViewProps = {
  month: Month;
  year: number;
  summary: ExpenseSummary;
  currentUserName: string;
  counterpartyName: string;
  settlement: SettlementCopy | null;
};

type SummaryTableProps = {
  title: string;
  action?: React.ReactNode;
  rows: Array<{
    label: string;
    value: string;
    tone?: 'default' | 'muted' | 'accent';
  }>;
};

function SummaryTable({ title, action, rows }: SummaryTableProps) {
  return (
    <section className="w-full rounded-3xl border border-border/40 bg-muted/30 p-4">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        {action}
      </div>

      <div>
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label} className="border-0">
                <TableCell
                  className={cn(
                    'px-2.5 py-1.5 text-sm',
                    row.tone === 'muted' && 'text-muted-foreground',
                    row.tone === 'accent' && 'font-medium text-foreground'
                  )}
                >
                  {row.label}
                </TableCell>
                <TableCell
                  className={cn(
                    'px-2.5 py-1.5 text-right font-medium',
                    row.tone === 'accent' && 'text-primary'
                  )}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function DashboardView({
  month,
  year,
  summary,
  currentUserName,
  counterpartyName,
  settlement,
}: DashboardViewProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalExpenseRows = [
    {
      label: 'Total expense',
      value: formatCurrency(summary.totalExpenses.total),
      tone: 'accent' as const,
    },
    {
      label: currentUserName,
      value: formatCurrency(summary.participantExpenses.currentUserTotal),
    },
    {
      label: counterpartyName,
      value: formatCurrency(summary.participantExpenses.counterpartyTotal),
    },
  ];
  const sharedExpenseRows = [
    {
      label: 'Total shared expense',
      value: formatCurrency(summary.sharedExpenses.total),
      tone: 'accent' as const,
    },
    {
      label: `${currentUserName} paid`,
      value: formatCurrency(summary.sharedExpenses.totalPaidByCurrentUser),
    },
    {
      label: `${counterpartyName} paid`,
      value: formatCurrency(summary.sharedExpenses.totalPaidByOtherUser),
    },
  ];
  const categoryRows =
    summary.totalExpenses.topCategories.length > 0
      ? summary.totalExpenses.topCategories.map((category) => ({
          label: category.name,
          value: formatCurrency(category.total),
        }))
      : [
          {
            label: 'No categories yet',
            value: formatCurrency(0),
            tone: 'muted' as const,
          },
        ];
  function updateRoute(nextMonth: Month, nextYear: number) {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set('month', nextMonth);
    nextParams.set('year', String(nextYear));

    startTransition(() => {
      router.replace(
        nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname,
        { scroll: true }
      );
    });
  }

  return (
    <Card
      size="sm"
      className="flex h-full min-h-0 w-full flex-1 flex-col shadow-sm"
    >
      <CardHeader>
        <CardTitle>{`${formatMonth(month)} ${year} - Expenses`}</CardTitle>

        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-full"
                aria-label="Open dashboard filters"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Filters</p>
                  <p className="text-sm text-muted-foreground">
                    Choose the month you want to review.
                  </p>
                </div>

                <MonthYearFilter
                  month={month}
                  year={year}
                  onMonthChange={(nextMonth) => updateRoute(nextMonth, year)}
                  onYearChange={(nextYear) => updateRoute(month, nextYear)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 overflow-y-auto pt-0 pb-4">
        {isPending ? (
          <DashboardMetricsSkeleton />
        ) : (
          <section
            aria-label="Expense summary"
            className="w-full space-y-3 pb-1"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <SummaryTable
                title="Expense overview"
                action={
                  <Button asChild size="xs" className="h-7 px-2.5 text-xs">
                    <Link href="/add-expense">
                      <Plus className="size-3.5" />
                      Add expense
                    </Link>
                  </Button>
                }
                rows={totalExpenseRows}
              />

              <SummaryTable title="Shared expense" rows={sharedExpenseRows} />
            </div>

            <SummaryTable title="Category wise expenses" rows={categoryRows} />

            {settlement ? (
              <section className="w-full rounded-3xl border border-border/60 bg-muted/30 px-4 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Settlement
                    </p>
                    <p className="text-sm font-medium">{settlement.text}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="text-sm font-semibold">
                      {formatCurrency(settlement.amount)}
                    </p>

                    <SettlementForm
                      defaultAmount={settlement.amount}
                      settlementText={settlement.text}
                    />
                  </div>
                </div>
              </section>
            ) : null}
          </section>
        )}
      </CardContent>
    </Card>
  );
}
