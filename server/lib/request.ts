import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '~/server/lib/auth';
import {
  DEFAULT_TIME_ZONE,
  resolveMonth,
  resolveTimeZone,
  resolveYear,
} from '~/server/lib/date';

type SearchParamValue = string | string[] | undefined;

type SearchParams = Record<string, SearchParamValue>;

function firstSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export async function resolveDateFilters(searchParams: Promise<SearchParams>) {
  const params = await searchParams;

  const monthParam = firstSearchParam(params.month);
  const yearParam = firstSearchParam(params.year);
  const timeZoneParam = firstSearchParam(params.timezone);

  const timeZone = resolveTimeZone(timeZoneParam ?? DEFAULT_TIME_ZONE);
  const month = resolveMonth(monthParam, timeZone);
  const year = resolveYear(yearParam, timeZone);

  return { month, year, timeZone };
}

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/signin');
  }

  return session;
}
