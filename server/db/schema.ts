import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

// tracker tables
export const ledgerEntryTypes = [
  'expense',
  'borrow',
  'lend',
  'settlement',
] as const;

export const ledgerEntryCategories = [
  'Groceries',
  'Restaurants',
  'Bills',
  'Home',
  'Shopping',
] as const;

export const ledgerEntry = sqliteTable(
  'ledger_entry',
  {
    id: text('id').primaryKey(),
    personId: text('person_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    type: text('type', { enum: ledgerEntryTypes }).notNull(),
    category: text('category', { enum: ledgerEntryCategories }).notNull(),
    tags: text('tags'),
    amount: real('amount').notNull(),
    paidByUserId: text('paid_by_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    isSplit: integer('is_split', { mode: 'boolean' }).default(false).notNull(),
    note: text('note'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    createdBy: text('created_by')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
  },
  (table) => [
    index('ledger_entry_person_id_idx').on(table.personId),
    index('ledger_entry_type_idx').on(table.type),
    index('ledger_entry_category_idx').on(table.category),
    index('ledger_entry_paid_by_user_id_idx').on(table.paidByUserId),
    index('ledger_entry_created_by_idx').on(table.createdBy),
    index('ledger_entry_updated_by_idx').on(table.updatedBy),
    check('ledger_entry_amount_positive_chk', sql`${table.amount} > 0`),
    check(
      'ledger_entry_split_type_chk',
      sql`${table.type} = 'expense' or ${table.isSplit} = false`
    ),
  ]
);

// better auth managed tables
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .default(false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

// table relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  personLedgerEntries: many(ledgerEntry, { relationName: 'personUser' }),
  createdLedgerEntries: many(ledgerEntry, { relationName: 'createdByUser' }),
  updatedLedgerEntries: many(ledgerEntry, { relationName: 'updatedByUser' }),
  paidLedgerEntries: many(ledgerEntry, { relationName: 'paidByUser' }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const ledgerEntryRelations = relations(ledgerEntry, ({ one }) => ({
  personUser: one(user, {
    fields: [ledgerEntry.personId],
    references: [user.id],
    relationName: 'personUser',
  }),
  paidByUser: one(user, {
    fields: [ledgerEntry.paidByUserId],
    references: [user.id],
    relationName: 'paidByUser',
  }),
  createdByUser: one(user, {
    fields: [ledgerEntry.createdBy],
    references: [user.id],
    relationName: 'createdByUser',
  }),
  updatedByUser: one(user, {
    fields: [ledgerEntry.updatedBy],
    references: [user.id],
    relationName: 'updatedByUser',
  }),
}));
