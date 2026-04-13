import { requireSession, resolveDateFilters } from '~/server/lib/request';
import { fetchExpensesByMonth } from '~/server/services/ledger';

import { AllExpensesView } from './all-expenses-view';

export default async function AllExpensesPage({
  searchParams,
}: PageProps<'/all-expenses'>) {
  const { month, year, timeZone } = await resolveDateFilters(searchParams);
  await requireSession();

  const expenses = await fetchExpensesByMonth({
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
