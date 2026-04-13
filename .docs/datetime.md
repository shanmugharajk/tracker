# Date and Time Guide

This document defines how date and time must work in this app.

We keep reintroducing the same class of bugs:

- query month window computed in one timezone
- timestamps rendered in another timezone
- ad hoc `new Date()` logic used in feature code
- month values converted back and forth between incompatible formats
- display concerns mixed with filtering concerns

This guide is the source of truth for future work.

Related execution plan:

1. Phase 1: fix datetime/timezone correctness first and merge that independently.
2. Phase 2: fix dashboard expense-summary logic and display semantics.
3. Phase 3: tweak dashboard UX after the numbers are correct.

---

## 1. Core Rules

### Rule 1: Store timestamps as absolute instants

Database timestamps such as `createdAt` are absolute instants.

- They are not "Toronto times"
- They are not "browser local times"
- They are not safe to reason about without an explicit timezone for display or filtering

In practice:

- DB rows are stored as timestamps
- filtering converts a user-selected month/year/timezone into `[start, end)` instants
- display formats those instants in the chosen timezone

---

### Rule 2: Filtering timezone and display timezone must match

If a page lets the user view April 2026 in `America/Los_Angeles`, then:

- month resolution must use `America/Los_Angeles`
- query window generation must use `America/Los_Angeles`
- display formatting must use `America/Los_Angeles`

Do not:

- resolve filters in one timezone and query in another
- render in a timezone that differs from the one used to build the database window

This is the bug we just reintroduced in the dashboard/all-expenses diff.

---

### Rule 3: Use half-open month windows

All month filtering must use:

- `start`: inclusive
- `end`: exclusive

Meaning:

```ts
createdAt >= start && createdAt < end
```

Do not use inclusive end-of-month timestamps. They are harder to reason about and create DST and precision bugs.

---

### Rule 4: Keep month values in the app-level `Month` type

We already have a canonical month type in:

- `lib/formatters/date.ts`

Use:

```ts
type Month = 'jan' | 'feb' | ... | 'dec';
```

Do not convert:

- `Month -> number -> Month`

unless you are at a boundary that truly requires a number.

Inside app code, `Month` is the source of truth.

---

### Rule 5: Resolve request inputs once at the edge

Search params are untrusted input.

Resolve them once near the route boundary using shared helpers, then pass the resolved values downward as typed data.

Current shared edge helper:

- `server/lib/request.ts`

Current date helpers:

- `resolveTimeZone()`
- `resolveMonth()`
- `resolveYear()`
- `getMonthWindow()`

Do not repeat search-param parsing in every page.

---

### Rule 6: Separate expense totals from shared-expense settlement math

This is adjacent to datetime and frequently gets tangled with it in month-based pages.

For the expense dashboard:

- total expenses include:
  - individual expenses
  - split expenses
- shared-expense metrics include:
  - split expenses
  - expense settlements
- balance is always relative to the current session user

Do not compute:

- total monthly expense
- per-person shared expense
- settlement balance

from the same undifferentiated row subset.

---

## 2. Approved Utilities

### `server/lib/date.ts`

This is the canonical place for server-side date resolution and month-window logic.

Use it for:

- sanitizing a timezone string
- deriving the current month/year in a timezone
- resolving request month/year values
- building month query windows

Use:

```ts
resolveTimeZone(input)
resolveMonth(input, timeZone)
resolveYear(input, timeZone)
getMonthWindow(month, timeZone, year)
```

Do not reimplement month math in page or service code.

---

### `server/lib/request.ts`

This is the route-level helper for request parsing.

Use:

```ts
const { month, year, timeZone } = await resolveDateFilters(searchParams);
```

This should be the normal entry point for pages that read month/year/timezone from the URL.

Expectation:

- route resolves filters once
- route passes resolved values to data and UI code
- downstream logic keeps expense-total and shared-expense calculations separate

---

### `lib/formatters/date.ts`

This file is for app-level month values and labels.

Use it for:

- `MONTHS`
- `Month`
- `formatMonth()`

Use it sparingly for conversions. If you need repeated `Month <-> number` conversion in feature code, that is usually a sign the API boundary is wrong.

---

### `lib/formatters/date-time.ts`

This file is for display formatting only.

Use:

```ts
formatDateTimeParts(date, timeZone)
```

This is appropriate in client components and tables when you already have:

- a `Date`
- the timezone to display it in

Do not use this file for:

- query filtering
- request parsing
- month boundary calculation
- business summary derivation

---

## 3. Approved Flow for Month-Based Pages

This is the pattern every month-filtered page should follow.

### Step 1: Resolve request filters at the route

```ts
const { month, year, timeZone } = await resolveDateFilters(searchParams);
```

### Step 2: Pass those exact values into data access

```ts
const entries = await fetchLedgerEntriesForMonth({
  month,
  year,
  timeZone,
});
```

### Step 3: Pass the same timezone into the UI

```tsx
return <PageView data={entries} month={month} year={year} timeZone={timeZone} />;
```

### Step 4: When the user changes month/year, keep timezone in the URL

If the page uses timezone-aware filtering, the client route update must preserve the timezone parameter.

This is already correct in:

- `app/(tracker)/all-expenses/all-expenses-view.tsx`

If a page omits timezone from the URL, that page is choosing to fall back to the default timezone and must do so intentionally.

---

## 4. What Not To Do

### Do not hardcode `DEFAULT_TIME_ZONE` inside a feature query path

Bad:

```ts
const { start, end } = getMonthWindow(month, DEFAULT_TIME_ZONE, year);
```

This is only acceptable when the product explicitly wants a fixed business timezone for that feature.

For user-facing month filters, this is usually wrong.

---

### Do not build month windows with raw `new Date(year, monthIndex, ...)`

Bad:

```ts
const start = new Date(year, monthIndex, 1);
```

Why it is bad:

- it depends on the server runtime timezone
- it silently changes behavior across environments
- it becomes wrong as soon as the user timezone differs from the server timezone

Use `getMonthWindow()` instead.

---

### Do not parse `searchParams` ad hoc in every page

Bad:

```ts
const monthParam = Array.isArray(params.month) ? params.month[0] : params.month;
```

Use `resolveDateFilters()` instead.

---

### Do not use display utilities for data logic

`formatDateTimeParts()` is for rendering only.

If you are using it to derive month, year, or filter logic, the code is in the wrong layer.

---

### Do not mix shared-expense semantics with total-spend semantics

This is not a pure date bug, but it frequently appears next to month-filtering work and must be designed correctly from the start.

Examples:

- total month spend
- individual month spend
- split-expense balance
- settlement balance

These metrics do not all operate on the same row set. Define the row subset first, then compute the metric.

---

## 5. Server vs Client Responsibilities

### Server responsibilities

- resolve request inputs
- validate timezone/month/year
- generate month windows
- query by `[start, end)`
- produce typed domain data
- return enough typed data to compute distinct summary sections safely

### Client responsibilities

- keep filters in the URL
- render the active month/year selection
- format timestamps for display using the resolved timezone

The client should not be inventing its own month window logic.

---

## 6. Existing Utilities and Their Intended Usage

### `resolveTimeZone(timeZone)`

Use when:

- input comes from the URL
- input comes from user settings
- you need a safe IANA timezone value

Guarantee:

- returns a supported timezone
- falls back to `DEFAULT_TIME_ZONE`

---

### `resolveMonth(month, timeZone)`

Use when:

- month input may be missing or invalid
- fallback should be based on the current month in the resolved timezone

Important:

- fallback month depends on timezone
- do not resolve month before resolving timezone

---

### `resolveYear(year, timeZone)`

Use when:

- year input may be missing or invalid
- fallback should use the current year in the resolved timezone

Important:

- fallback year depends on timezone

---

### `getMonthWindow(month, timeZone, year)`

Use when:

- building month-based query filters

Guarantee:

- returns a timezone-safe month window
- `start` and `end` are absolute `Date` instances suitable for DB filtering

Required query form:

```ts
where(
  and(
    gte(table.createdAt, start),
    lt(table.createdAt, end)
  )
)
```

---

### `formatDateTimeParts(date, timeZone)`

Use when:

- rendering a stored timestamp to the user

Do not use when:

- deriving business logic
- deciding which month a row belongs to

---

## 7. Recommended Design Rules for New Code

### Rule A: Every month-based service should accept timezone explicitly

Recommended shape:

```ts
type MonthQuery = {
  month: Month;
  year: number;
  timeZone: string;
};
```

Avoid:

```ts
type MonthQuery = {
  month: number;
  year: number;
};
```

The first shape matches the app model and prevents timezone loss.

---

### Rule B: Name services after what they return

If a query returns:

- all expense rows
- shared expense rows
- expenses plus settlements
- entries enriched for dashboard summary

those should not all hide behind the same ambiguous function name.

Prefer explicit naming over boolean flags that blur domain meaning.

---

### Rule C: Keep feature semantics out of generic date helpers

`server/lib/date.ts` should stay focused on:

- timezone resolution
- current month/year resolution
- month window generation

It should not know about:

- expenses
- settlements
- dashboard metrics

---

## 8. Testing Checklist for Date/Time Changes

Any change touching month filtering, date formatting, or routing should be checked against this list.

### Query correctness

- Same record appears in the expected month for:
  - `America/Toronto`
  - one western timezone
  - one eastern timezone

### Boundary correctness

- record at first minute of the month
- record at last minute before next month
- DST transition month

### Routing correctness

- month/year changes preserve timezone when required
- page refresh preserves the same filtered dataset

### Rendering correctness

- timestamps render in the same timezone used for filtering

---

## 9. Practical Guidance for This Codebase

When adding a new month-based page:

1. Use `resolveDateFilters(searchParams)` in the page.
2. Pass `month`, `year`, and `timeZone` into the service.
3. Use `getMonthWindow(month, timeZone, year)` in the service.
4. Use `formatDateTimeParts(date, timeZone)` only in the UI.
5. Preserve `timezone` in URL updates if the page is timezone-aware.

When working on the expense dashboard:

1. Keep `Total expenses` separate from `Shared expenses`.
2. `Total expenses` should include:
   - individual expenses
   - split expenses
3. `Individual total` should include only non-split expenses.
4. Shared-expense stats should be derived only from:
   - split expense rows
   - expense settlements
5. "You owe" / "owes you" must always be relative to the session user.
6. Loan logic is a separate route and should not complicate the expense dashboard implementation right now.

When reviewing code:

- If you see raw `new Date(...)` in filtering logic, stop.
- If you see `DEFAULT_TIME_ZONE` injected into a user-filtered query, stop.
- If you see `Month -> number -> Month`, question the API shape.
- If you see one timezone used for querying and another for display, treat it as a bug.

---

## 10. Current Known Gaps

These are areas to keep improving:

- `fetchExpensesByMonth()` currently drops the resolved timezone and should be fixed.
- Dashboard summary logic currently mixes:
  - total expenses
  - individual expenses
  - shared-expense settlement math
- We do not yet have automated tests around timezone boundary cases.

Until those are fixed, use this document as the review checklist before merging date-sensitive changes.
