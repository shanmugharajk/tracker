import { requireSession, resolveDateFilters } from '~/server/lib/request';
import {
  fetchExpensesByMonth,
  getSettlementCopy,
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
  const currentUserName = session.user.name.trim();
  const counterpartyName =
    summary.sharedExpenses.counterparty.name?.trim() || 'Other person';
  const settlement = getSettlementCopy(
    summary.sharedExpenses.balance,
    currentUserName,
    counterpartyName
  );

  return (
    <DashboardView
      month={month}
      year={year}
      summary={summary}
      currentUserName={currentUserName}
      counterpartyName={counterpartyName}
      settlement={settlement}
    />
  );
}
