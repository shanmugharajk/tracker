import type { ExpenseRecord } from './ledger';

export type CategorySummary = {
  name: string;
  total: number;
};

export type ExpenseSummary = {
  totalExpense: number;
  expensePerPerson: number;
  totalSpendByCurrentUser: number;
  totalSpendByOtherUser: number;
  otherPersonName: string | null;
  balance: number;
  topCategories: CategorySummary[];
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function getTopCategories(entries: ExpenseRecord[]): CategorySummary[] {
  const categoryTotals = new Map<string, number>();

  for (const entry of entries) {
    if (entry.type !== 'expense') {
      continue;
    }

    const category = entry.category?.trim();

    if (!category) {
      continue;
    }

    categoryTotals.set(
      category,
      (categoryTotals.get(category) ?? 0) + entry.amount
    );
  }

  return [...categoryTotals.entries()]
    .map(([name, total]) => ({ name, total: roundCurrency(total) }))
    .sort(
      (left, right) =>
        right.total - left.total || left.name.localeCompare(right.name)
    )
    .slice(0, 3);
}

function getOtherPerson(
  entries: ExpenseRecord[],
  currentUserId: string
): { id: string | null; name: string | null } {
  for (const entry of entries) {
    if (entry.personId && entry.personId !== currentUserId) {
      return {
        id: entry.personId,
        name: entry.personName,
      };
    }

    if (entry.paidByUserId && entry.paidByUserId !== currentUserId) {
      return {
        id: entry.paidByUserId,
        name: entry.paidByUserName,
      };
    }
  }

  return { id: null, name: null };
}

export function summarizeExpenses(
  entries: ExpenseRecord[],
  currentUserId: string
): ExpenseSummary {
  const expenseEntries = entries.filter((entry) => entry.type === 'expense');
  const { id: otherPersonId, name: otherPersonName } = getOtherPerson(
    entries,
    currentUserId
  );

  let totalExpense = 0;
  let totalSpendByCurrentUser = 0;
  let totalSpendByOtherUser = 0;
  let balance = 0;

  for (const entry of expenseEntries) {
    totalExpense += entry.amount;

    if (entry.paidByUserId === currentUserId) {
      totalSpendByCurrentUser += entry.amount;
    } else if (
      (otherPersonId && entry.paidByUserId === otherPersonId) ||
      (!otherPersonId && entry.paidByUserId !== currentUserId)
    ) {
      totalSpendByOtherUser += entry.amount;
    }
  }

  for (const entry of entries) {
    if (!entry.personId || entry.personId !== otherPersonId) {
      continue;
    }

    if (entry.type === 'expense' && entry.isSplit) {
      const share = entry.amount / 2;

      balance += entry.paidByUserId === currentUserId ? share : -share;
    }

    if (entry.type === 'settlement') {
      balance +=
        entry.paidByUserId === currentUserId ? -entry.amount : entry.amount;
    }
  }

  return {
    totalExpense: roundCurrency(totalExpense),
    expensePerPerson: roundCurrency(totalExpense / 2),
    totalSpendByCurrentUser: roundCurrency(totalSpendByCurrentUser),
    totalSpendByOtherUser: roundCurrency(totalSpendByOtherUser),
    otherPersonName,
    balance: roundCurrency(balance),
    topCategories: getTopCategories(entries),
  };
}
