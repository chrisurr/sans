/** Domänen-Modelle für sa'ns (Prototyp – nur lokale Daten). */

export type User = {
  id: string;
  name: string;
  email: string;
  /** Nur Mock – im echten Backend niemals Klartext speichern. */
  password: string;
  emoji: string;
  color: string;
};

export type Event = {
  id: string;
  title: string;
  location: string;
  /** ISO-Zeitstempel des Event-Beginns. */
  date: string;
  description?: string;
  hostId: string;
  attendeeIds: string[];
};

/**
 * Status eines Aufpass-Auftrags.
 * pending = angefragt, accepted = angenommen,
 * declined = abgelehnt, completed = abgeschlossen.
 */
export type WatchStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export const STATUS_LABEL: Record<WatchStatus, string> = {
  pending: 'Angefragt',
  accepted: 'Angenommen',
  declined: 'Abgelehnt',
  completed: 'Abgeschlossen',
};

/**
 * Ein Auftrag, auf eine Person (ward) aufzupassen.
 * guardian = beauftragter Buddy, ward = die Person, die alleine ist.
 */
export type WatchAssignment = {
  id: string;
  eventId: string;
  /** Person, auf die aufgepasst werden soll. */
  wardId: string;
  /** Beauftragter Aufpasser/Buddy. */
  guardianId: string;
  /** Wer den Auftrag erstellt hat. */
  createdById: string;
  note?: string;
  status: WatchStatus;
  createdAt: string;
};
