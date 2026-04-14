import { requireSession, resolveDateFilters } from '~/server/lib/request';
import {
  fetchExpenseEntriesByMonth,
  summarizeExpenses,
} from '~/server/services/expense';

import { DashboardView } from './dashboard-view';

export default async function DashboardPage({ searchParams }: PageProps<'/'>) {
  const { month, year, timeZone } = await resolveDateFilters(searchParams);
  await requireSession();

  const expenses = await fetchExpenseEntriesByMonth({ month, year, timeZone });
  const summary = summarizeExpenses(expenses);

  return (
    <DashboardView
      month={month}
      year={year}
      summary={summary}
    />
  );
}
