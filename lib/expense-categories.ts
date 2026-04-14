export const expenseCategoryValues = [
  'Groceries',
  'Restaurants',
  'Bills',
  'Home',
  'Shopping',
] as const;

export type ExpenseCategory = (typeof expenseCategoryValues)[number];

export const expenseCategoryMeta = {
  Groceries: { emoji: '🥬', title: 'Groceries' },
  Restaurants: { emoji: '🍜', title: 'Restaurants' },
  Bills: { emoji: '🧾', title: 'Bills' },
  Home: { emoji: '🏠', title: 'Home' },
  Shopping: { emoji: '🛍️', title: 'Shopping' },
} satisfies Record<ExpenseCategory, { emoji: string; title: string }>;

export const expenseCategories = expenseCategoryValues.map((value) => ({
  value,
  ...expenseCategoryMeta[value],
})) as {
  value: ExpenseCategory;
  emoji: string;
  title: string;
}[];
