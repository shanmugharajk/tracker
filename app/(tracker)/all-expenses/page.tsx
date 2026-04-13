import {
  DEFAULT_TIME_ZONE,
  resolveMonth,
  resolveTimeZone,
  resolveYear,
} from '~/server/lib/date';
import { fetchExpensesByMonth } from '~/server/services/ledger';

import { AllExpensesView } from './all-expenses-view';

export default async function AllExpenses({
  searchParams,
}: PageProps<'/all-expenses'>) {
  const params = await searchParams;

  const monthParam = Array.isArray(params.month)
    ? params.month[0]
    : params.month;
  const yearParam = Array.isArray(params.year) ? params.year[0] : params.year;

  const timeZoneParam = Array.isArray(params.timezone)
    ? params.timezone[0]
    : params.timezone;

  const timeZone = resolveTimeZone(timeZoneParam ?? DEFAULT_TIME_ZONE);
  const month = resolveMonth(monthParam, timeZone);
  const year = resolveYear(yearParam, timeZone);

  const expenses = await fetchExpensesByMonth(month, timeZone, year);

  return (
    <AllExpensesView
      data={expenses}
      month={month}
      year={year}
      timeZone={timeZone}
    />
  );
}
