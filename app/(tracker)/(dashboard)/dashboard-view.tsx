'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { MoreHorizontal, Plus, User } from 'lucide-react';
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
import { formatMonth, type Month } from '~/lib/formatters/date';
import { cn } from '~/lib/cn';
import type { ExpenseSummary } from '~/server/services/ledger';

import { DashboardMetricsSkeleton } from './dashboard-card-skeleton';
import { formatCurrency } from '~/lib/formatters/currency';

type DashboardViewProps = {
  month: Month;
  year: number;
  summary: ExpenseSummary;
};

type StatProps = {
  label: string;
  value: string;
  tone?: string;
  showDot?: boolean;
  dotClassName?: string;
  className?: string;
};

function Stat({
  label,
  value,
  tone,
  showDot,
  dotClassName,
  className,
}: StatProps) {
  return (
    <div className={cn('min-w-0 flex-1 space-y-0.5 text-left', className)}>
      <div className="flex items-center gap-1.5">
        {showDot ? (
          <span
            aria-hidden="true"
            className={cn('h-2 w-2 shrink-0 rounded-full', dotClassName)}
          />
        ) : null}
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p
        className={cn(
          'text-sm font-semibold tracking-tight sm:text-base',
          tone
        )}
      >
        {value}
      </p>
    </div>
  );
}

function getBalanceState(summary: ExpenseSummary) {
  const otherPersonLabel =
    summary.sharedExpenses.counterparty.name ?? 'Other person';
  const amount = formatCurrency(Math.abs(summary.sharedExpenses.balance));

  if (summary.sharedExpenses.balance > 0) {
    return {
      eyebrow: 'They owe',
      amount,
      name: otherPersonLabel,
      tone: 'text-emerald-700 dark:text-emerald-400',
      accent: 'bg-emerald-500',
    };
  }

  if (summary.sharedExpenses.balance < 0) {
    return {
      eyebrow: 'You owe',
      amount,
      name: otherPersonLabel,
      tone: 'text-rose-700 dark:text-rose-400',
      accent: 'bg-rose-500',
    };
  }

  return {
    eyebrow: 'Settled',
    amount: formatCurrency(0),
    name: otherPersonLabel,
    tone: 'text-foreground',
    accent: 'bg-foreground/40',
  };
}

export function DashboardView({ month, year, summary }: DashboardViewProps) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const balanceState = getBalanceState(summary);
  const amountYouOwe =
    summary.sharedExpenses.balance < 0
      ? Math.abs(summary.sharedExpenses.balance)
      : 0;
  const youOweLabel =
    summary.sharedExpenses.balance < 0 && balanceState.name
      ? `You owe ${balanceState.name}`
      : 'You owe';
  const youPaidLabel = summary.sharedExpenses.counterparty.name
    ? `You paid for ${summary.sharedExpenses.counterparty.name}`
    : 'You paid';
  const otherPaidLabel = summary.sharedExpenses.counterparty.name
    ? `${summary.sharedExpenses.counterparty.name} paid`
    : 'Other person paid';

  function updateRoute(nextMonth: Month, nextYear: number) {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set('month', nextMonth);
    nextParams.set('year', String(nextYear));

    startTransition(() => {
      router.replace(
        nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname,
        { scroll: false }
      );
    });
  }

  return (
    <Card className="w-full rounded-[32px] bg-card shadow-sm">
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

      <CardContent>
        {isPending ? (
          <DashboardMetricsSkeleton />
        ) : (
          <section aria-label="Expense summary">
            <div className="space-y-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">Total expenses</p>
                  <p className="text-xs text-muted-foreground">
                    Includes individual and shared expenses for this month.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Stat
                    label="Total"
                    value={formatCurrency(summary.totalExpenses.total)}
                  />
                  <Stat
                    label="Individual total"
                    value={formatCurrency(summary.totalExpenses.individualTotal)}
                  />
                  <Stat
                    label="Shared total"
                    value={formatCurrency(summary.sharedExpenses.total)}
                  />
                </div>

                {summary.totalExpenses.topCategories.length > 0 ? (
                  <div className="flex justify-between gap-2">
                    {summary.totalExpenses.topCategories.map((category) => (
                      <Stat
                        key={category.name}
                        label={category.name}
                        value={formatCurrency(category.total)}
                        className="border-l-2 border-teal-600 p-2"
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-sm font-semibold">Shared expenses</p>
                  <p className="text-xs text-muted-foreground">
                    Split expenses and expense settlements only.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Stat
                    label="Shared total"
                    value={formatCurrency(summary.sharedExpenses.total)}
                  />
                  <Stat
                    label="Per person"
                    value={formatCurrency(summary.sharedExpenses.expensePerPerson)}
                  />
                  <Stat
                    label={youPaidLabel}
                    value={formatCurrency(
                      summary.sharedExpenses.totalPaidByCurrentUser
                    )}
                  />
                  <Stat
                    label={otherPaidLabel}
                    value={formatCurrency(
                      summary.sharedExpenses.totalPaidByOtherUser
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 rounded-2xl bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {balanceState.eyebrow}
                    </p>
                    <p className={cn('text-lg font-semibold', balanceState.tone)}>
                      {balanceState.amount}
                    </p>
                  </div>

                  <Stat
                    label={youOweLabel}
                    value={formatCurrency(amountYouOwe)}
                    tone={
                      summary.sharedExpenses.balance < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-foreground'
                    }
                    showDot={summary.sharedExpenses.balance < 0}
                    dotClassName="bg-rose-500 dark:bg-rose-400"
                    className="max-w-[160px] flex-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button asChild size="xs" className="h-8 px-3 text-sm">
                <Link href="/add-expense">
                  <Plus className="size-4" />
                  Expense
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="xs"
                className="h-8 px-3 text-sm"
              >
                <Link href="/add-expense?type=settlement">
                  <User className="size-4" />
                  Settle
                </Link>
              </Button>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
