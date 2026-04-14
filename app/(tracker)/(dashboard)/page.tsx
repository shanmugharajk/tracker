import { requireSession, resolveDateFilters } from '~/server/lib/request';
import {
  fetchLedgerEntriesByMonth,
  summarizeExpenses,
} from '~/server/services/ledger';

import { DashboardView } from './dashboard-view';

export default async function DashboardPage({ searchParams }: PageProps<'/'>) {
  const { month, year, timeZone } = await resolveDateFilters(searchParams);
  await requireSession();

  const expenses = await fetchLedgerEntriesByMonth({ month, year, timeZone });
  const summary = summarizeExpenses(expenses);

  return (
    <DashboardView
      month={month}
      year={year}
      summary={summary}
    />
  );
}
