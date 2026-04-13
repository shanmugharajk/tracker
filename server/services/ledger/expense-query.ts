import {
  fetchLedgerEntriesByMonth,
  type FetchLedgerEntriesByMonthParams,
  type LedgerEntryRecord,
} from './ledger';

export type ExpenseRecord = LedgerEntryRecord;

export type FetchExpensesByMonthParams = FetchLedgerEntriesByMonthParams & {
  includeSettlement?: boolean;
};

function isExpenseRecord(entry: LedgerEntryRecord, includeSettlement: boolean) {
  if (entry.type === 'expense') {
    return true;
  }

  return (
    includeSettlement &&
    entry.type === 'settlement' &&
    entry.settlementFor === 'expense'
  );
}

export function selectExpenseRecords(
  entries: LedgerEntryRecord[],
  includeSettlement = false
) {
  return entries.filter((entry) => isExpenseRecord(entry, includeSettlement));
}

// Expense pages currently operate on a two-person domain: the session user and
// one counterparty in the returned expense rows. Loan flows are separate.
export async function fetchExpensesByMonth(
  params: FetchExpensesByMonthParams
): Promise<ExpenseRecord[]> {
  const { includeSettlement = false, ...ledgerParams } = params;
  const ledgerEntries = await fetchLedgerEntriesByMonth(ledgerParams);

  return selectExpenseRecords(ledgerEntries, includeSettlement);
}
