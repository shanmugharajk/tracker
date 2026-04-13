'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { type Month } from '~/lib/formatters/date';
import type { ExpenseRecord } from '~/server/services/ledger';

import { AllExpensesFilters } from './all-expenses-filters';
import { AllExpensesTable } from './all-expenses-table';

type AllExpensesViewProps = {
  data: ExpenseRecord[];
  month: Month;
  year: number;
  timeZone: string;
};

function normalizeExpenseFilter(value: string) {
  return value.trim().toLowerCase();
}

function matchesExpenseFilter(expense: ExpenseRecord, query: string) {
  const category = expense.category?.trim().toLowerCase() ?? '';
  const tag = expense.tags?.trim().toLowerCase() ?? '';

  return category.startsWith(query) || tag.startsWith(query);
}

export function AllExpensesView({
  data,
  month,
  year,
  timeZone,
}: AllExpensesViewProps) {
  const [filter, setFilter] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filteredData = useMemo(() => {
    const normalizedFilter = normalizeExpenseFilter(filter);

    if (!normalizedFilter) {
      return data;
    }

    return data.filter((expense) =>
      matchesExpenseFilter(expense, normalizedFilter)
    );
  }, [data, filter]);

  function updateRoute(nextMonth: Month, nextYear: number) {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set('month', nextMonth);
    nextParams.set('year', String(nextYear));
    nextParams.set('timezone', timeZone);

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col">
      <CardHeader className="border-b">
        <AllExpensesFilters
          filter={filter}
          month={month}
          year={year}
          onFilterChange={setFilter}
          onMonthChange={(nextMonth: Month) => updateRoute(nextMonth, year)}
          onYearChange={(nextYear: number) => updateRoute(month, nextYear)}
        />
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 overflow-hidden p-0">
        <AllExpensesTable data={filteredData} timeZone={timeZone} />
      </CardContent>
    </Card>
  );
}
