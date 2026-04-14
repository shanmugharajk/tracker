import type { ExpenseRecord } from './expense-query';

export type CategorySummary = {
  name: string;
  total: number;
};

export type DashboardCounterparty = {
  id: string | null;
  name: string | null;
};

export type TotalExpenseSummary = {
  total: number;
  individualTotal: number;
  topCategories: CategorySummary[];
};

export type ParticipantExpenseSummary = {
  currentUserTotal: number;
  counterpartyTotal: number;
};

export type SettlementCopy = {
  text: string;
  amount: number;
};

export type SharedExpenseSummary = {
  total: number;
  expensePerPerson: number;
  totalPaidByCurrentUser: number;
  totalPaidByOtherUser: number;
  balance: number;
  counterparty: DashboardCounterparty;
};

export type ExpenseSummary = {
  totalExpenses: TotalExpenseSummary;
  sharedExpenses: SharedExpenseSummary;
  participantExpenses: ParticipantExpenseSummary;
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function sumAmounts(entries: ExpenseRecord[]) {
  return roundCurrency(
    entries.reduce((total, entry) => total + entry.amount, 0)
  );
}

function getTopCategories(entries: ExpenseRecord[]): CategorySummary[] {
  const categoryTotals = new Map<string, number>();

  for (const entry of entries) {
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

function getCounterpartyCandidates(
  entries: ExpenseRecord[],
  currentUserId: string
) {
  const people = new Map<string, string | null>();

  for (const entry of entries) {
    if (entry.personId && entry.personId !== currentUserId) {
      people.set(entry.personId, entry.personName);
    }

    if (entry.paidByUserId && entry.paidByUserId !== currentUserId) {
      people.set(entry.paidByUserId, entry.paidByUserName);
    }
  }

  return [...people.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((left, right) => {
      const leftName = left.name?.trim() ?? '';
      const rightName = right.name?.trim() ?? '';

      return (
        leftName.localeCompare(rightName) || left.id.localeCompare(right.id)
      );
    });
}

function getDashboardCounterparty(
  entries: ExpenseRecord[],
  currentUserId: string
): DashboardCounterparty {
  // Expense dashboard is intentionally a session-user vs one-counterparty view.
  const [counterparty] = getCounterpartyCandidates(entries, currentUserId);

  return counterparty ?? { id: null, name: null };
}

function entryBelongsToUser(entry: ExpenseRecord, userId: string) {
  return entry.paidByUserId === userId || entry.personId === userId;
}

function sumIndividualExpenseTotals(
  entries: ExpenseRecord[],
  currentUserId: string,
  counterpartyId: string | null
) {
  const currentUserTotal = sumAmounts(
    entries.filter((entry) => entryBelongsToUser(entry, currentUserId))
  );
  const counterpartyTotal = counterpartyId
    ? sumAmounts(
        entries.filter((entry) => entryBelongsToUser(entry, counterpartyId))
      )
    : 0;

  return {
    currentUserTotal,
    counterpartyTotal,
  };
}

function summarizeSharedBalance(
  sharedExpenseEntries: ExpenseRecord[],
  settlementEntries: ExpenseRecord[],
  currentUserId: string
) {
  let balance = 0;

  for (const entry of sharedExpenseEntries) {
    const share = entry.amount / 2;

    balance += entry.paidByUserId === currentUserId ? share : -share;
  }

  for (const entry of settlementEntries) {
    balance +=
      entry.paidByUserId === currentUserId ? -entry.amount : +entry.amount;
  }

  return roundCurrency(balance);
}

export function getSettlementCopy(
  balance: number,
  currentUserName: string,
  counterpartyName: string
): SettlementCopy | null {
  if (balance === 0) {
    return null;
  }

  if (balance > 0) {
    return {
      text: `${counterpartyName} owes ${currentUserName}`,
      amount: Math.abs(balance),
    };
  }

  return {
    text: `${currentUserName} owes ${counterpartyName}`,
    amount: Math.abs(balance),
  };
}

export function summarizeExpenses(
  entries: ExpenseRecord[],
  currentUserId: string
): ExpenseSummary {
  const counterparty = getDashboardCounterparty(entries, currentUserId);
  const expenseEntries = entries.filter((entry) => entry.type === 'expense');
  const splitExpenseEntries = expenseEntries.filter((entry) => entry.isSplit);
  const individualExpenseEntries = expenseEntries.filter(
    (entry) => !entry.isSplit
  );
  const expenseSettlementEntries = entries.filter(
    (entry) => entry.type === 'settlement' && entry.settlementFor === 'expense'
  );
  const participantExpenses = sumIndividualExpenseTotals(
    individualExpenseEntries,
    currentUserId,
    counterparty.id
  );

  const totalPaidByCurrentUser = sumAmounts(
    splitExpenseEntries.filter((entry) => entry.paidByUserId === currentUserId)
  );
  const totalPaidByOtherUser = sumAmounts(
    splitExpenseEntries.filter(
      (entry) =>
        Boolean(counterparty.id) && entry.paidByUserId === counterparty.id
    )
  );
  const sharedTotal = sumAmounts(splitExpenseEntries);
  const sharedPerPerson = roundCurrency(sharedTotal / 2);

  return {
    totalExpenses: {
      total: sumAmounts(expenseEntries),
      individualTotal: sumAmounts(individualExpenseEntries),
      topCategories: getTopCategories(expenseEntries),
    },
    sharedExpenses: {
      total: sharedTotal,
      expensePerPerson: sharedPerPerson,
      totalPaidByCurrentUser,
      totalPaidByOtherUser,
      balance: summarizeSharedBalance(
        splitExpenseEntries,
        expenseSettlementEntries,
        currentUserId
      ),
      counterparty,
    },
    participantExpenses: {
      currentUserTotal: participantExpenses.currentUserTotal + sharedPerPerson,
      counterpartyTotal:
        participantExpenses.counterpartyTotal + sharedPerPerson,
    },
  };
}
