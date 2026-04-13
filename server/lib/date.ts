import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import {
  FILTER_YEAR_END,
  FILTER_YEAR_START,
  MONTHS,
  type Month,
} from '~/lib/formatters/date';

export const DEFAULT_TIME_ZONE = 'America/Toronto';

const MONTH_INDEX = new Map<Month, number>(
  MONTHS.map((month, index) => [month, index])
);

/**
 * Left-pad a numeric value to two digits.
 *
 * @example
 * ```ts
 * pad(3); // "03"
 * pad(12); // "12"
 * ```
 */
function pad(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * Build an ISO timestamp string from the date/time parts you pass in.
 *
 * This does not read the current clock. It just turns the provided year,
 * month, day, hour, and minute into `YYYY-MM-DDTHH:mm:00` using UTC math so
 * the server's local timezone cannot change the result.
 *
 * @example
 * ```ts
 * buildIsoTimestampFromParts(2026, 4, 12);
 * // "2026-04-12T00:00:00"
 *
 * buildIsoTimestampFromParts(2026, 4, 12, 9, 30);
 * // "2026-04-12T09:30:00"
 * ```
 */
function buildIsoTimestampFromParts(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0
) {
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  return `${utcDate.getUTCFullYear()}-${pad(utcDate.getUTCMonth() + 1)}-${pad(
    utcDate.getUTCDate()
  )}T${pad(utcDate.getUTCHours())}:${pad(utcDate.getUTCMinutes())}:00`;
}

/**
 * Check whether an IANA timezone string is supported by the runtime.
 *
 * @example
 * ```ts
 * isValidTimeZone('America/Toronto'); // true
 * isValidTimeZone('Not/A-Timezone'); // false
 * ```
 */
function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve a requested timezone to a safe, supported value.
 *
 * Trims whitespace, preserves valid IANA timezone names, and falls back to
 * `DEFAULT_TIME_ZONE` when the input is missing or invalid.
 *
 * @example
 * ```ts
 * resolveTimeZone('  Europe/London  '); // "Europe/London"
 * resolveTimeZone('bad-value'); // "America/Toronto"
 * resolveTimeZone(); // "America/Toronto"
 * ```
 */
export function resolveTimeZone(timeZone?: string | null) {
  const normalized = timeZone?.trim();

  if (normalized && isValidTimeZone(normalized)) {
    return normalized;
  }

  return DEFAULT_TIME_ZONE;
}

/**
 * Get the current date/time in the resolved timezone.
 *
 * @example
 * ```ts
 * getZonedNow('UTC'); // Date representing "now" in UTC
 * ```
 */
function getZonedNow(timeZone: string | null | undefined) {
  return toZonedTime(new Date(), resolveTimeZone(timeZone));
}

/**
 * Get the current year in the provided timezone.
 *
 * @example
 * ```ts
 * getCurrentYear('America/New_York'); // e.g. 2026
 * ```
 */
export function getCurrentYear(
  timeZone: string | null | undefined = DEFAULT_TIME_ZONE
) {
  return getZonedNow(timeZone).getFullYear();
}

/**
 * Get the current month abbreviation in the provided timezone.
 *
 * Returns one of the canonical month values from `MONTHS`.
 *
 * @example
 * ```ts
 * getCurrentMonth('America/Toronto'); // "jan" | "feb" | ... | "dec"
 * ```
 */
export function getCurrentMonth(
  timeZone: string | null | undefined = DEFAULT_TIME_ZONE
): Month {
  return MONTHS[getZonedNow(timeZone).getMonth()] ?? 'jan';
}

/**
 * Clamp a year to the configured filter range.
 *
 * @example
 * ```ts
 * clampYear(1900); // FILTER_YEAR_START
 * clampYear(3000); // FILTER_YEAR_END
 * ```
 */
function clampYear(year: number) {
  return Math.min(FILTER_YEAR_END, Math.max(FILTER_YEAR_START, year));
}

/**
 * Resolve a month input to a canonical three-letter month value.
 *
 * Invalid or missing values fall back to the current month in the resolved
 * timezone.
 *
 * @example
 * ```ts
 * resolveMonth('September'); // "sep"
 * resolveMonth('  NOV  '); // "nov"
 * resolveMonth('not-a-month', 'America/Toronto'); // current month
 * ```
 */
export function resolveMonth(
  month: string | null | undefined,
  timeZone: string | null | undefined = DEFAULT_TIME_ZONE
) {
  if (!month) {
    return getCurrentMonth(timeZone);
  }

  const normalized = month.trim().slice(0, 3).toLowerCase();

  return MONTH_INDEX.has(normalized as Month)
    ? (normalized as Month)
    : getCurrentMonth(timeZone);
}

/**
 * Resolve a year input to a bounded integer year.
 *
 * Accepts numbers or numeric strings, clamps the result to the configured
 * filter range, and falls back to the current year in the resolved timezone
 * when the input is missing or invalid.
 *
 * @example
 * ```ts
 * resolveYear('2024'); // 2024
 * resolveYear(1999); // FILTER_YEAR_START or 1999, depending on config
 * resolveYear('bad-value', 'America/Toronto'); // current year, clamped
 * ```
 */
export function resolveYear(
  year: number | string | null | undefined,
  timeZone: string | null | undefined = DEFAULT_TIME_ZONE
) {
  const fallbackYear = clampYear(getCurrentYear(timeZone));

  if (typeof year === 'number' && Number.isInteger(year)) {
    return clampYear(year);
  }

  if (typeof year === 'string') {
    const parsedYear = Number.parseInt(year.trim(), 10);

    if (Number.isInteger(parsedYear)) {
      return clampYear(parsedYear);
    }
  }

  return fallbackYear;
}

/**
 * Build the start and end timestamps for a given month in a timezone.
 *
 * The returned range is half-open: `start` is inclusive and `end` is the
 * first instant of the following month, exclusive.
 *
 * @example
 * ```ts
 * getResolvedMonthRange('jan', 'America/Toronto', 2026);
 * // { start: Date, end: Date }
 * ```
 */
function getResolvedMonthRange(
  month: Month,
  resolvedTimeZone: string,
  year = getCurrentYear(resolvedTimeZone)
) {
  const monthIndex = MONTH_INDEX.get(month);

  if (monthIndex === undefined) {
    throw new Error(`Missing month index for "${month}".`);
  }

  // Build the month boundaries from explicit date parts so the server's local
  // timezone does not affect the result.
  const start = fromZonedTime(
    buildIsoTimestampFromParts(year, monthIndex + 1, 1),
    resolvedTimeZone
  );
  const end = fromZonedTime(
    buildIsoTimestampFromParts(year, monthIndex + 2, 1),
    resolvedTimeZone
  );

  return { start, end };
}

/**
 * Resolve month/year inputs and return the month window used for filtering.
 *
 * The function normalizes the month, resolves a safe timezone, clamps the
 * year, and returns inclusive start / exclusive end timestamps for that
 * month.
 *
 * @example
 * ```ts
 * getMonthWindow('feb', 'America/Toronto', '2026');
 * // {
 * //   month: "feb",
 * //   year: 2026,
 * //   start: Date,
 * //   end: Date
 * // }
 * ```
 */
export function getMonthWindow(
  month: string | null | undefined,
  timeZone: string | null | undefined = DEFAULT_TIME_ZONE,
  year?: number | string | null
) {
  const resolvedTimeZone = resolveTimeZone(timeZone);
  const resolvedMonth = resolveMonth(month, resolvedTimeZone);
  const resolvedYear = resolveYear(year, resolvedTimeZone);
  const { start, end } = getResolvedMonthRange(
    resolvedMonth,
    resolvedTimeZone,
    resolvedYear
  );

  return {
    month: resolvedMonth,
    year: resolvedYear,
    start,
    end,
  };
}
