import { requireSession } from '~/server/lib/request';
import { fetchExpenseUsers } from '~/server/services/users';

import { AddExpenseForm } from './add-expense-form';

export default async function AddExpensePage() {
  const session = await requireSession();
  const expenseUsers = await fetchExpenseUsers();
  const users = expenseUsers.some((user) => user.id === session.user.id)
    ? expenseUsers
    : [
        {
          id: session.user.id,
          name: session.user.name.trim(),
        },
        ...expenseUsers,
      ];

  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <AddExpenseForm users={users} currentUserId={session.user.id} />
    </main>
  );
}
