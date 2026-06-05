import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, GradientButton, Screen, StatusBadge } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import { formatEventDate } from '../utils/date';
import type { AppStackScreenProps } from '../navigation/types';

export function EventDetailScreen({ route, navigation }: AppStackScreenProps<'EventDetail'>) {
  const { eventId } = route.params;
  const { getEvent, getUser, currentUser, toggleAttendance, assignments } = useApp();

  const event = getEvent(eventId);
  if (!event) {
    return (
      <Screen>
        <Text style={styles.fallback}>Event nicht gefunden.</Text>
      </Screen>
    );
  }

  const host = getUser(event.hostId);
  const attendees = event.attendeeIds.map(getUser).filter(Boolean) as NonNullable<
    ReturnType<typeof getUser>
  >[];
  const isAttending = !!currentUser && event.attendeeIds.includes(currentUser.id);
  const eventAssignments = assignments.filter((a) => a.eventId === eventId);

  return (
    <Screen contentStyle={{ paddingTop: spacing(2) }}>
      {/* Kopfbereich */}
      <Card style={styles.hero}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>📍 {event.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>🕘 {formatEventDate(event.date)}</Text>
        </View>
        {host ? (
          <View style={styles.hostRow}>
            <Avatar user={host} size={26} />
            <Text style={styles.hostText}>Gastgeber: {host.name}</Text>
          </View>
        ) : null}
        {event.description ? <Text style={styles.desc}>{event.description}</Text> : null}

        <Button
          label={isAttending ? 'Du bist dabei ✓  ·  Absagen' : 'Ich bin dabei!'}
          variant={isAttending ? 'success' : 'solid'}
          onPress={() => toggleAttendance(event.id)}
          style={{ marginTop: spacing(4) }}
        />
      </Card>

      {/* Aufpass-CTA */}
      <GradientButton
        label="Aufpasser beauftragen"
        icon="🛡️"
        onPress={() => navigation.navigate('CreateAssignment', { eventId })}
        style={{ marginTop: spacing(5) }}
      />
      <Text style={styles.ctaHint}>
        Jemand ist alleine? Beauftrage einen Buddy, der auf die Person aufpasst.
      </Text>

      {/* Teilnehmer */}
      <SectionTitle>Teilnehmer · {attendees.length}</SectionTitle>
      <Card style={{ gap: spacing(1) }}>
        {attendees.map((u, i) => (
          <View
            key={u.id}
            style={[styles.personRow, i > 0 && styles.personDivider]}
          >
            <Avatar user={u} size={38} />
            <Text style={styles.personName}>{u.name}</Text>
            {u.id === currentUser?.id ? <Text style={styles.youTag}>du</Text> : null}
            {u.id === event.hostId ? <Text style={styles.hostTag}>Gastgeber</Text> : null}
          </View>
        ))}
      </Card>

      {/* Aufpass-Aufträge */}
      <SectionTitle>Aufpass-Aufträge · {eventAssignments.length}</SectionTitle>
      {eventAssignments.length === 0 ? (
        <Card>
          <Text style={styles.empty}>
            Noch keine Aufträge. Erstelle den ersten, damit niemand alleine bleibt. 💜
          </Text>
        </Card>
      ) : (
        <View style={{ gap: spacing(3) }}>
          {eventAssignments.map((a) => {
            const ward = getUser(a.wardId);
            const guardian = getUser(a.guardianId);
            return (
              <Card key={a.id}>
                <View style={styles.assignTop}>
                  <View style={styles.assignPeople}>
                    <Avatar user={guardian} size={36} />
                    <Text style={styles.assignArrow}>🛡️→</Text>
                    <Avatar user={ward} size={36} />
                  </View>
                  <StatusBadge status={a.status} />
                </View>
                <Text style={styles.assignText}>
                  <Text style={styles.assignName}>{guardian?.name}</Text> passt auf{' '}
                  <Text style={styles.assignName}>{ward?.name}</Text> auf
                </Text>
                {a.note ? <Text style={styles.assignNote}>„{a.note}"</Text> : null}
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

const styles = StyleSheet.create({
  fallback: { color: colors.textMuted, marginTop: spacing(10), textAlign: 'center' },
  hero: { padding: spacing(5) },
  title: { color: colors.text, fontSize: font.h1, fontWeight: '800' },
  metaRow: { marginTop: spacing(2) },
  meta: { color: colors.textMuted, fontSize: font.body },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(2), marginTop: spacing(3) },
  hostText: { color: colors.textMuted, fontSize: 14 },
  desc: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing(4),
    opacity: 0.9,
  },
  ctaHint: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing(2),
  },

  section: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    marginTop: spacing(7),
    marginBottom: spacing(3),
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(3),
    paddingVertical: spacing(2),
  },
  personDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  personName: { color: colors.text, fontSize: 15, fontWeight: '600', flex: 1 },
  youTag: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: `${colors.accent}22`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  hostTag: {
    color: colors.pink,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: `${colors.pink}22`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  empty: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },

  assignTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing(3),
  },
  assignPeople: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  assignArrow: { color: colors.textMuted, fontSize: 16 },
  assignText: { color: colors.text, fontSize: 15 },
  assignName: { fontWeight: '700' },
  assignNote: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: spacing(2),
    lineHeight: 18,
  },
});
