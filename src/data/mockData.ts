import { Event, User, WatchAssignment } from '../types';
import { colors } from '../theme';

/**
 * Seed-Daten für den Prototyp. Alle Demo-Accounts haben das
 * gleiche Passwort, damit man sich leicht einloggen kann.
 */
export const DEMO_PASSWORD = 'demo1234';

export const seedUsers: User[] = [
  { id: 'u1', name: 'benapp', email: 'benapp@demo.de', password: DEMO_PASSWORD, emoji: '🦊', color: colors.primary },
  { id: 'u2', name: 'Lena', email: 'lena@demo.de', password: DEMO_PASSWORD, emoji: '🦄', color: colors.pink },
  { id: 'u3', name: 'Max', email: 'max@demo.de', password: DEMO_PASSWORD, emoji: '🐼', color: colors.accent },
  { id: 'u4', name: 'Sophie', email: 'sophie@demo.de', password: DEMO_PASSWORD, emoji: '🐝', color: colors.warning },
  { id: 'u5', name: 'Jonas', email: 'jonas@demo.de', password: DEMO_PASSWORD, emoji: '🐯', color: colors.success },
  { id: 'u6', name: 'Mara', email: 'mara@demo.de', password: DEMO_PASSWORD, emoji: '🦋', color: '#9B8CFF' },
];

export const seedEvents: Event[] = [
  {
    id: 'e1',
    title: 'Sommer Rooftop Party',
    location: 'Skybar, Dachterrasse',
    date: '2026-06-07T21:00:00',
    description: 'Sonnenuntergang, Cocktails und gute Musik über den Dächern der Stadt.',
    hostId: 'u2',
    attendeeIds: ['u1', 'u2', 'u3', 'u4'],
  },
  {
    id: 'e2',
    title: 'Max wird 30 🎉',
    location: 'Garten bei Max',
    date: '2026-06-14T19:00:00',
    description: 'Große Geburtstagssause mit Grill, Bar und Tanzfläche.',
    hostId: 'u3',
    attendeeIds: ['u2', 'u3', 'u5', 'u6'],
  },
  {
    id: 'e3',
    title: 'Clubnacht im Loft',
    location: 'Loft Club, Innenstadt',
    date: '2026-06-20T23:00:00',
    description: 'Techno bis in die Morgenstunden. Passt aufeinander auf!',
    hostId: 'u5',
    attendeeIds: ['u1', 'u5', 'u6'],
  },
];

export const seedAssignments: WatchAssignment[] = [
  {
    id: 'a1',
    eventId: 'e1',
    wardId: 'u4', // Sophie ist alleine
    guardianId: 'u1', // benapp soll aufpassen
    createdById: 'u2',
    note: 'Sophie kennt kaum jemanden – behalt sie bitte im Blick. 💜',
    status: 'pending',
    createdAt: '2026-06-01T12:00:00',
  },
  {
    id: 'a2',
    eventId: 'e3',
    wardId: 'u6', // Mara
    guardianId: 'u1', // benapp
    createdById: 'u5',
    note: 'Mara geht vielleicht früher – bring sie sicher zum Taxi.',
    status: 'accepted',
    createdAt: '2026-05-30T18:30:00',
  },
];
