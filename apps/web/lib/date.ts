import { format, parseISO } from 'date-fns';

const FORMAT = 'd MMMM yyyy';

export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

export function formatISODate(date: string): string {
  return format(parseDate(date), FORMAT);
}

export function getFormattedNowDate(): string {
  return format(new Date(), FORMAT);
}
