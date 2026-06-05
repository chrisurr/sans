/** Datums-/Zeit-Formatierung auf Deutsch für die UI. */

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} · ${time} Uhr`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

/** Kompaktes Datums-Badge (Tag + Monat) für Karten. */
export function dateBadge(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return { day: String(d.getDate()), month: MONTHS[d.getMonth()].toUpperCase() };
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
