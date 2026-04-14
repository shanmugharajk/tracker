import { db, ledgerEntry } from '~/server/db';

import { SEED_USER_ROLES, type SeedUserIds, type SeedUserRole } from './shared';

// Seed fixtures intentionally use the server runtime timezone. These values are
// not user-facing timezone data, so we keep them simple and do not normalize
// them through a separate timezone layer.
type LedgerSeed = {
  id: string;
  category: 'Groceries' | 'Restaurants' | 'Bills' | 'Home' | 'Shopping';
  tags: string | null;
  amount: number;
  paidByRole: SeedUserRole;
  note: string;
  createdAt: number;
  updatedAt: number;
};

const PRIMARY_USER = SEED_USER_ROLES[0];
const SECONDARY_USER = SEED_USER_ROLES[1];

const resolveAuditRole = (entry: LedgerSeed) => entry.paidByRole;

const SEED_YEAR = 2026;
// Date months are zero-based, so 3 means April.
const SEED_MONTH = 3;

const seedTimestamp = (day: number, hour: number, minute: number) =>
  new Date(SEED_YEAR, SEED_MONTH, day, hour, minute).getTime();

const ledgers = [
  {
    id: '9fd958ee-e763-47ae-9ea1-78b3d89de625',
    category: 'Restaurants',
    tags: 'food',
    amount: 18,
    paidByRole: PRIMARY_USER,
    note: 'Morning coffee and pastry',
    createdAt: seedTimestamp(1, 9, 12),
    updatedAt: seedTimestamp(1, 9, 12),
  },
  {
    id: 'a9223f99-5ca1-406d-9e02-8ed9db8d1ee5',
    category: 'Restaurants',
    tags: 'food',
    amount: 40,
    paidByRole: SECONDARY_USER,
    note: 'Dinner at restaurant',
    createdAt: seedTimestamp(2, 10, 15),
    updatedAt: seedTimestamp(2, 10, 15),
  },
  {
    id: '8a663030-2f30-411a-8414-af84a54ec2d7',
    category: 'Groceries',
    tags: 'food',
    amount: 80,
    paidByRole: PRIMARY_USER,
    note: 'Shared grocery run',
    createdAt: seedTimestamp(3, 11, 30),
    updatedAt: seedTimestamp(3, 11, 30),
  },
  {
    id: 'db6ef8a4-a0b1-4896-81fc-701f2f54ff41',
    category: 'Bills',
    tags: 'phone',
    amount: 67,
    paidByRole: SECONDARY_USER,
    note: 'Paid phone bill for my line',
    createdAt: seedTimestamp(4, 14, 45),
    updatedAt: seedTimestamp(4, 14, 45),
  },
  {
    id: '0739b24e-0572-41b8-acab-cecfeb8ebd10',
    category: 'Groceries',
    tags: 'food',
    amount: 60,
    paidByRole: PRIMARY_USER,
    note: 'Grocery run',
    createdAt: seedTimestamp(5, 16, 10),
    updatedAt: seedTimestamp(5, 16, 10),
  },
  {
    id: '573df000-b3d4-4e80-9cb8-5596d8be9376',
    category: 'Restaurants',
    tags: 'food',
    amount: 100,
    paidByRole: SECONDARY_USER,
    note: 'Weekend lunch with takeaway',
    createdAt: seedTimestamp(6, 9, 50),
    updatedAt: seedTimestamp(6, 9, 50),
  },
  {
    id: '88034123-d051-473e-ab7f-3578d8902d52',
    category: 'Home',
    tags: 'mobile-bill',
    amount: 70,
    paidByRole: PRIMARY_USER,
    note: 'Shared home supplies',
    createdAt: seedTimestamp(7, 10, 20),
    updatedAt: seedTimestamp(7, 10, 20),
  },
  {
    id: '19d08eff-ab52-4f82-845c-8498afbd7dca',
    category: 'Shopping',
    tags: 'clothes',
    amount: 25,
    paidByRole: PRIMARY_USER,
    note: 'Personal stationery pickup',
    createdAt: seedTimestamp(8, 13, 5),
    updatedAt: seedTimestamp(8, 13, 5),
  },
  {
    id: '58f8685a-2f1f-4931-adda-b44938c4639f',
    category: 'Bills',
    tags: 'internet',
    amount: 55,
    paidByRole: SECONDARY_USER,
    note: 'Paid internet bill',
    createdAt: seedTimestamp(9, 15, 35),
    updatedAt: seedTimestamp(9, 15, 35),
  },
] satisfies LedgerSeed[];

export async function seedLedgerEntries(userIds: SeedUserIds) {
  const resolvedLedgers = ledgers.map((entry) => ({
    id: entry.id,
    category: entry.category,
    tags: entry.tags,
    amount: entry.amount,
    paidByUserId: userIds[entry.paidByRole],
    note: entry.note,
    createdAt: new Date(entry.createdAt),
    updatedAt: new Date(entry.updatedAt),
    createdBy: userIds[resolveAuditRole(entry)],
    updatedBy: userIds[resolveAuditRole(entry)],
  }));

  await db.insert(ledgerEntry).values(resolvedLedgers).onConflictDoNothing();
  console.log(`🌱 Seeded ledger entries: ${resolvedLedgers.length}`);
}
