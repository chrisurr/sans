import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarStack, Card, Screen } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import type { Event } from '../types';
import { dateBadge, formatEventDate } from '../utils/date';
import type { TabScreenProps } from '../navigation/types';

export function EventsListScreen({ navigation }: TabScreenProps<'Events'>) {
  const { events, currentUser, getUser, assignments } = useApp();

  const sorted = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const pendingForMe = assignments.filter(
    (a) => a.guardianId === currentUser?.id && a.status === 'pending',
  ).length;

  return (
    <Screen contentStyle={{ paddingTop: spacing(2) }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.hello}>Hey {currentUser?.name} {currentUser?.emoji}</Text>
          <Text style={styles.heading}>Anstehende Events</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate('CreateEvent')}>
          <Text style={styles.addBtnText}>＋</Text>
        </Pressable>
      </View>

      {pendingForMe > 0 ? (
        <Pressable
          style={styles.banner}
          onPress={() => navigation.navigate('Assignments')}
        >
          <Text style={styles.bannerEmoji}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              {pendingForMe} offene Aufpass-Anfrage{pendingForMe > 1 ? 'n' : ''}
            </Text>
            <Text style={styles.bannerText}>Tippe, um zu antworten →</Text>
          </View>
        </Pressable>
      ) : null}

      <View style={{ gap: spacing(3), marginTop: spacing(4) }}>
        {sorted.map((event) => (
          <EventListCard
            key={event.id}
            event={event}
            attendees={event.attendeeIds.map(getUser).filter(Boolean) as any}
            watchCount={assignments.filter((a) => a.eventId === event.id).length}
            onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
          />
        ))}
      </View>
    </Screen>
  );
}

function EventListCard({
  event,
  attendees,
  watchCount,
  onPress,
}: {
  event: Event;
  attendees: import('../types').User[];
  watchCount: number;
  onPress: () => void;
}) {
  const badge = dateBadge(event.date);
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{badge.day}</Text>
          <Text style={styles.dateMonth}>{badge.month}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>📍 {event.location}</Text>
          <Text style={styles.cardMeta}>🕘 {formatEventDate(event.date)}</Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={styles.attendees}>
          <AvatarStack users={attendees} />
          <Text style={styles.attendeeCount}>{attendees.length} dabei</Text>
        </View>
        {watchCount > 0 ? (
          <View style={styles.watchPill}>
            <Text style={styles.watchPillText}>🛡️ {watchCount}</Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(2),
  },
  hello: { color: colors.textMuted, fontSize: font.body },
  heading: { color: colors.text, fontSize: font.h1, fontWeight: '800', marginTop: 2 },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: colors.pink, fontSize: 26, fontWeight: '700', marginTop: -2 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    backgroundColor: `${colors.warning}1A`,
    borderColor: `${colors.warning}55`,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing(4),
    marginTop: spacing(3),
  },
  bannerEmoji: { fontSize: 26 },
  bannerTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  bannerText: { color: colors.textMuted, fontSize: 13, marginTop: 2 },

  card: { padding: spacing(4) },
  cardTop: { flexDirection: 'row', gap: spacing(4) },
  dateBadge: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { color: colors.text, fontSize: 22, fontWeight: '800', lineHeight: 24 },
  dateMonth: { color: colors.pink, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  cardTitle: { color: colors.text, fontSize: font.h3, fontWeight: '700' },
  cardMeta: { color: colors.textMuted, fontSize: 13, marginTop: 3 },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing(4),
    paddingTop: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attendees: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  attendeeCount: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  watchPill: {
    backgroundColor: `${colors.primary}22`,
    borderRadius: radius.pill,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
  },
  watchPillText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
