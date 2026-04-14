import { requireSession } from '~/server/lib/request';
import { fetchExpenseUsers } from '~/server/services/users';

import { AddExpenseForm } from './add-expense-form';

export default async function AddExpensePage() {
  await requireSession();
  const users = await fetchExpenseUsers();

  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <AddExpenseForm users={users} />
    </main>
  );
}
