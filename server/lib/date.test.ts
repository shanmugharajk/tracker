import { describe, expect, test } from 'bun:test';

import { getMonthWindow, resolveMonth, resolveYear } from '~/server/lib/date';

describe('date resolution uses one timezone consistently', () => {
  test('resolves month/year and query window in the requested timezone', () => {
    const timeZone = 'America/Los_Angeles';
    const month = resolveMonth('apr', timeZone);
    const year = resolveYear('2026', timeZone);
    const window = getMonthWindow(month, timeZone, year);

    expect(month).toBe('apr');
    expect(year).toBe(2026);
    expect(window.month).toBe(month);
    expect(window.year).toBe(year);
    expect(window.start.toISOString()).toBe('2026-04-01T07:00:00.000Z');
    expect(window.end.toISOString()).toBe('2026-05-01T07:00:00.000Z');
  });

  test('month boundaries stay stable across different resolved timezones', () => {
    const torontoWindow = getMonthWindow('apr', 'America/Toronto', 2026);
    const losAngelesWindow = getMonthWindow('apr', 'America/Los_Angeles', 2026);

    expect(torontoWindow.start.toISOString()).toBe('2026-04-01T04:00:00.000Z');
    expect(torontoWindow.end.toISOString()).toBe('2026-05-01T04:00:00.000Z');
    expect(losAngelesWindow.start.toISOString()).toBe('2026-04-01T07:00:00.000Z');
    expect(losAngelesWindow.end.toISOString()).toBe('2026-05-01T07:00:00.000Z');
  });
});
