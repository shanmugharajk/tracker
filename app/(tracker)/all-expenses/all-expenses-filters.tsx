'use client';

import {
  FILTER_YEARS,
  MONTHS,
  formatMonth,
  type Month,
} from '~/lib/formatters/date';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_11rem_11rem]">
      <div className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
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

      <div className="flex flex-col gap-1.5">
        <Select
          value={month}
          onValueChange={(nextMonth) => onMonthChange(nextMonth as Month)}
        >
          <SelectTrigger aria-label="Select month">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((itemMonth) => (
              <SelectItem key={itemMonth} value={itemMonth}>
                {formatMonth(itemMonth)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Select
          value={String(year)}
          onValueChange={(nextYear) =>
            onYearChange(Number.parseInt(nextYear, 10))
          }
        >
          <SelectTrigger aria-label="Select year">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_YEARS.map((itemYear) => (
              <SelectItem key={itemYear} value={String(itemYear)}>
                {itemYear}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
