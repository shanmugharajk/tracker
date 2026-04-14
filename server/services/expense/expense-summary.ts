import type { ExpenseRecord } from './expense';

export type CategorySummary = {
  name: string;
  total: number;
};

export type TotalExpenseSummary = {
  total: number;
  paidByUserTotals: ExpensePayerSummary[];
  topCategories: CategorySummary[];
};

export type ExpensePayerSummary = {
  id: string;
  name: string;
  total: number;
};

export type ExpenseSummary = {
  totalExpenses: TotalExpenseSummary;
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function sumAmounts(entries: ExpenseRecord[]) {
  return roundCurrency(
    entries.reduce((total, entry) => total + entry.amount, 0)
  );
}

function getCategorySummaries(entries: ExpenseRecord[]): CategorySummary[] {
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
    );
}

function getPayerSummaries(entries: ExpenseRecord[]): ExpensePayerSummary[] {
  const payers = new Map<string, ExpensePayerSummary>();

  for (const entry of entries) {
    const payerName = entry.paidByUserName?.trim() || 'Unknown user';
    const existing = payers.get(entry.paidByUserId);

    payers.set(entry.paidByUserId, {
      id: entry.paidByUserId,
      name: existing?.name ?? payerName,
      total: roundCurrency((existing?.total ?? 0) + entry.amount),
    });
  }

  return [...payers.values()].sort(
    (left, right) =>
      left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
  );
}

export function summarizeExpenses(
  entries: ExpenseRecord[]
): ExpenseSummary {
  return {
    totalExpenses: {
      total: sumAmounts(entries),
      paidByUserTotals: getPayerSummaries(entries),
      topCategories: getCategorySummaries(entries),
    },
  };
}
