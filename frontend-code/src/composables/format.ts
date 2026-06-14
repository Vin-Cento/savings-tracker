export function formatMoney(amount: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatTimeLocale(
  date: string,
  locale: string | string[] = 'en-US',
  options: Intl.DateTimeFormatOptions = {},
  add: { hours?: number; minutes?: number; seconds?: number } = {}
): string {
  const newDate = new Date(date);

  if (add.hours) newDate.setHours(newDate.getHours() + add.hours);
  if (add.minutes) newDate.setMinutes(newDate.getMinutes() + add.minutes);
  if (add.seconds) newDate.setSeconds(newDate.getSeconds() + add.seconds);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(locale, formatOptions).format(newDate);
}
