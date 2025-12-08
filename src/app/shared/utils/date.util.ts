export function getFirstDayOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1)
    .toISOString()
    .split('T')[0];
}

export function getLastDayOfMonth(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];
}

export function toDateTimeString(date: string, endOfDay = false): string {
  if (!date) return '';

  return endOfDay
    ? `${date}T23:59:59`
    : `${date}T00:00:00`;
}