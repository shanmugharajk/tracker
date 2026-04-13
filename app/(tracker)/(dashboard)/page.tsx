import { requireSession, resolveDateFilters } from '~/server/lib/request';
import {
  fetchExpensesByMonth,
  summarizeExpenses,
} from '~/server/services/ledger';

import { DashboardView } from './dashboard-view';

export default async function DashboardPage({ searchParams }: PageProps<'/'>) {
  const { month, year, timeZone } = await resolveDateFilters(searchParams);
  const session = await requireSession();

  const expenses = await fetchExpensesByMonth({
    month,
    year,
    timeZone,
    includeSettlement: true,
  });

  const summary = summarizeExpenses(expenses, session.user.id);

  return <DashboardView month={month} year={year} summary={summary} />;
}
