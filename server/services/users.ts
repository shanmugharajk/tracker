import { asc, eq } from 'drizzle-orm';

import { db, user } from '~/server/db';

export type ExpenseUserRecord = Awaited<ReturnType<typeof fetchExpenseUsers>>[number];

export async function fetchExpenseUsers() {
  return db
    .select({
      id: user.id,
      name: user.name,
      userType: user.userType,
    })
    .from(user)
    .where(eq(user.userType, 'expense'))
    .orderBy(asc(user.name));
}
