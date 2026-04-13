export const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

export type Month = (typeof MONTHS)[number];

export function getMonthNumber(month: Month) {
  return MONTHS.indexOf(month) + 1;
}

export function getMonthFromNumber(month: number) {
  const resolvedMonth = MONTHS[month - 1];

  if (!resolvedMonth) {
    throw new RangeError(`Month must be between 1 and 12. Received ${month}.`);
  }

  return resolvedMonth;
}

export const FILTER_YEAR_START = 2025;
export const FILTER_YEAR_END = 2045;
export const FILTER_YEARS = Array.from(
  { length: FILTER_YEAR_END - FILTER_YEAR_START + 1 },
  (_, index) => FILTER_YEAR_START + index
);

export function formatMonth(month: Month) {
  return `${month.slice(0, 1).toUpperCase()}${month.slice(1)}`;
}
