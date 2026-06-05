import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedAssignments, seedEvents, seedUsers, DEMO_PASSWORD } from '../data/mockData';
import { colors } from '../theme';
import { Event, User, WatchAssignment, WatchStatus } from '../types';
import { makeId } from '../utils/id';

const SESSION_KEY = 'sans.session.userId';

type AuthResult = { ok: true } | { ok: false; error: string };

type NewEventInput = {
  title: string;
  location: string;
  date: string;
  description?: string;
};

type AppState = {
  ready: boolean;
  currentUser: User | null;
  users: User[];
  events: Event[];
  assignments: WatchAssignment[];

  // Auth
  login: (email: string, password: string) => AuthResult;
  loginAs: (userId: string) => void;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;

  // Events
  createEvent: (input: NewEventInput) => Event;
  toggleAttendance: (eventId: string) => void;

  // Aufpass-Aufträge
  createAssignment: (input: {
    eventId: string;
    wardId: string;
    guardianId: string;
    note?: string;
  }) => WatchAssignment;
  respondToAssignment: (id: string, accepted: boolean) => void;
  completeAssignment: (id: string) => void;

  // Helfer
  getUser: (id: string) => User | undefined;
  getEvent: (id: string) => Event | undefined;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [events, setEvents] = useState<Event[]>(seedEvents);
  const [assignments, setAssignments] = useState<WatchAssignment[]>(seedAssignments);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Gespeicherte Session beim Start wiederherstellen.
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_KEY);
        if (stored) setCurrentUserId(stored);
      } catch {
        // Im Prototyp ignorieren wir Storage-Fehler.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persistSession = useCallback((id: string | null) => {
    setCurrentUserId(id);
    if (id) AsyncStorage.setItem(SESSION_KEY, id).catch(() => {});
    else AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
  }, []);

  const getUser = useCallback((id: string) => users.find((u) => u.id === id), [users]);
  const getEvent = useCallback((id: string) => events.find((e) => e.id === id), [events]);

  const login = useCallback<AppState['login']>(
    (email, password) => {
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) return { ok: false, error: 'Kein Konto mit dieser E-Mail gefunden.' };
      if (user.password !== password) return { ok: false, error: 'Falsches Passwort.' };
      persistSession(user.id);
      return { ok: true };
    },
    [users, persistSession],
  );

  const loginAs = useCallback<AppState['loginAs']>(
    (userId) => persistSession(userId),
    [persistSession],
  );

  const register = useCallback<AppState['register']>(
    (name, email, password) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!name.trim()) return { ok: false, error: 'Bitte gib einen Namen ein.' };
      if (!cleanEmail.includes('@')) return { ok: false, error: 'Bitte gib eine gültige E-Mail ein.' };
      if (password.length < 4) return { ok: false, error: 'Passwort braucht mind. 4 Zeichen.' };
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        return { ok: false, error: 'Diese E-Mail ist bereits registriert.' };
      }
      const palette = [colors.primary, colors.pink, colors.accent, colors.warning, colors.success];
      const emojis = ['🦁', '🐧', '🦉', '🐙', '🦩', '🐳', '🦒', '🐺'];
      const newUser: User = {
        id: makeId('u'),
        name: name.trim(),
        email: cleanEmail,
        password,
        emoji: emojis[users.length % emojis.length],
        color: palette[users.length % palette.length],
      };
      setUsers((prev) => [...prev, newUser]);
      persistSession(newUser.id);
      return { ok: true };
    },
    [users, persistSession],
  );

  const logout = useCallback(() => persistSession(null), [persistSession]);

  const createEvent = useCallback<AppState['createEvent']>(
    (input) => {
      const host = currentUserId ?? 'u1';
      const event: Event = {
        id: makeId('e'),
        title: input.title.trim(),
        location: input.location.trim(),
        date: input.date,
        description: input.description?.trim() || undefined,
        hostId: host,
        attendeeIds: [host],
      };
      setEvents((prev) => [event, ...prev]);
      return event;
    },
    [currentUserId],
  );

  const toggleAttendance = useCallback<AppState['toggleAttendance']>(
    (eventId) => {
      if (!currentUserId) return;
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          const isIn = e.attendeeIds.includes(currentUserId);
          return {
            ...e,
            attendeeIds: isIn
              ? e.attendeeIds.filter((id) => id !== currentUserId)
              : [...e.attendeeIds, currentUserId],
          };
        }),
      );
    },
    [currentUserId],
  );

  const createAssignment = useCallback<AppState['createAssignment']>(
    (input) => {
      const assignment: WatchAssignment = {
        id: makeId('a'),
        eventId: input.eventId,
        wardId: input.wardId,
        guardianId: input.guardianId,
        createdById: currentUserId ?? 'u1',
        note: input.note?.trim() || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setAssignments((prev) => [assignment, ...prev]);
      return assignment;
    },
    [currentUserId],
  );

  const setStatus = useCallback((id: string, status: WatchStatus) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const respondToAssignment = useCallback<AppState['respondToAssignment']>(
    (id, accepted) => setStatus(id, accepted ? 'accepted' : 'declined'),
    [setStatus],
  );

  const completeAssignment = useCallback<AppState['completeAssignment']>(
    (id) => setStatus(id, 'completed'),
    [setStatus],
  );

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId],
  );

  const value: AppState = {
    ready,
    currentUser,
    users,
    events,
    assignments,
    login,
    loginAs,
    register,
    logout,
    createEvent,
    toggleAttendance,
    createAssignment,
    respondToAssignment,
    completeAssignment,
    getUser,
    getEvent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp muss innerhalb von <AppProvider> verwendet werden.');
  return ctx;
}

export { DEMO_PASSWORD };
