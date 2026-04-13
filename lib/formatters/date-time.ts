const DATE_TIME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function getDateTimeFormatter(timeZone: string) {
  // Reuse one formatter per timezone so table cells don't recreate the same
  // Intl formatter repeatedly during renders.
  const existingFormatter = DATE_TIME_FORMATTERS.get(timeZone);

  if (existingFormatter) {
    return existingFormatter;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  DATE_TIME_FORMATTERS.set(timeZone, formatter);

  return formatter;
}

function extractDateTimeParts(date: Date, timeZone: string) {
  // formatToParts lets us control date and time rendering separately without
  // relying on brittle string splitting.
  const groupedParts = getDateTimeFormatter(timeZone)
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }

      return acc;
    }, {});

  return {
    datePart: [
      groupedParts.day ?? '--',
      groupedParts.month ?? '--',
      groupedParts.year ?? '----',
    ].join('-'),
    timePart: [groupedParts.hour ?? '--', groupedParts.minute ?? '--']
      .join(':')
      .concat(groupedParts.dayPeriod ? ` ${groupedParts.dayPeriod}` : ''),
  };
}

export function formatDateTimeParts(date: Date, timeZone: string) {
  // Returns the display-friendly pieces used by the expenses table.
  return extractDateTimeParts(date, timeZone);
}
