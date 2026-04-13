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
import type { ExpenseSummary } from '~/server/services/expense-summary';

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
  const otherPersonLabel = summary.otherPersonName ?? 'Other person';
  const amount = formatCurrency(Math.abs(summary.balance));

  if (summary.balance > 0) {
    return {
      eyebrow: 'They owe',
      amount,
      name: otherPersonLabel,
      tone: 'text-emerald-700 dark:text-emerald-400',
      accent: 'bg-emerald-500',
    };
  }

  if (summary.balance < 0) {
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
  const amountYouOwe = summary.balance < 0 ? Math.abs(summary.balance) : 0;
  const youOweLabel =
    summary.balance < 0 && balanceState.name
      ? `You owe ${balanceState.name}`
      : 'You owe';

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
            {/* Top 3 categories start */}
            <div className="mb-6 flex gap-2 justify-between">
              {summary.topCategories.map((category) => (
                <Stat
                  key={category.name}
                  label={category.name}
                  value={formatCurrency(category.total)}
                  className="border-l-2 border-teal-600 p-2"
                />
              ))}
            </div>
            {/* Top 3 categories start */}

            <div className="flex items-center justify-between gap-2">
              <Stat
                label="Total spent"
                value={formatCurrency(summary.totalExpense)}
              />
              <Stat
                label="Per person"
                value={formatCurrency(summary.expensePerPerson)}
              />
              <Stat
                label={youOweLabel}
                value={formatCurrency(amountYouOwe)}
                tone={
                  summary.balance < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-foreground'
                }
                showDot={summary.balance < 0}
                dotClassName="bg-rose-500 dark:bg-rose-400"
              />
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
