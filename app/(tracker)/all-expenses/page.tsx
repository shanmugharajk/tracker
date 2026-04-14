import { requireSession, resolveDateFilters } from '~/server/lib/request';
import { fetchLedgerEntriesByMonth } from '~/server/services/ledger';

import { AllExpensesView } from './all-expenses-view';

export default async function AllExpensesPage({
  searchParams,
}: PageProps<'/all-expenses'>) {
  const { month, year, timeZone } = await resolveDateFilters(searchParams);
  await requireSession();

  const expenses = await fetchLedgerEntriesByMonth({
    month,
    year,
    timeZone,
    includeSettlement: false,
  });

  return (
    <AllExpensesView
      data={expenses}
      month={month}
      year={year}
      timeZone={timeZone}
    />
  );
}
