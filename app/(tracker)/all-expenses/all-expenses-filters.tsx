'use client';

import { type Month } from '~/lib/formatters/date';
import { MonthYearFilter } from '~/components/ui/month-year-filter';
import { Input } from '~/components/ui/input';

type AllExpensesFiltersProps = {
  filter: string;
  month: Month;
  year: number;
  onFilterChange: (value: string) => void;
  onMonthChange: (value: Month) => void;
  onYearChange: (value: number) => void;
};

export function AllExpensesFilters({
  filter,
  month,
  year,
  onFilterChange,
  onMonthChange,
  onYearChange,
}: AllExpensesFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="all-expenses-filter" className="sr-only">
          Filter expenses by category or tag
        </label>
        <Input
          id="all-expenses-filter"
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="category or tag"
        />
      </div>

      <MonthYearFilter
        month={month}
        year={year}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />
    </div>
  );
}
