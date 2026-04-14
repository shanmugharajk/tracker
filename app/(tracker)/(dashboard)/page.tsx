import { requireSession, resolveDateFilters } from '~/server/lib/request';
import {
  fetchExpensesByMonth,
  getSettlementCopy,
  summarizeExpenses,
} from '~/server/services/ledger';
import { fetchExpenseUsers } from '~/server/services/users';

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
  const expenseUsers = await fetchExpenseUsers();
  const otherUser = expenseUsers.find((user) => user.id !== session.user.id);

  const summary = summarizeExpenses(expenses, session.user.id);
  const currentUserName = session.user.name.trim();

  const counterpartyName = otherUser?.name ?? 'Other user';

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
