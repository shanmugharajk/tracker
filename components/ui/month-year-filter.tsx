'use client';

import {
  FILTER_YEARS,
  MONTHS,
  formatMonth,
  type Month,
} from '~/lib/formatters/date';
import { cn } from '~/lib/cn';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

type MonthYearFilterProps = {
  month: Month;
  year: number;
  onMonthChange: (value: Month) => void;
  onYearChange: (value: number) => void;
  className?: string;
};

export function MonthYearFilter({
  month,
  year,
  onMonthChange,
  onYearChange,
  className,
}: MonthYearFilterProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
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
  );
}
