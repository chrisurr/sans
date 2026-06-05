import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, Screen, StatusBadge } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import { formatShortDate } from '../utils/date';
import type { WatchAssignment } from '../types';
import type { TabScreenProps } from '../navigation/types';

export function AssignmentsScreen({ navigation }: TabScreenProps<'Assignments'>) {
  const { assignments, currentUser, getUser, getEvent, respondToAssignment, completeAssignment } =
    useApp();
  const me = currentUser?.id;

  const requests = assignments.filter((a) => a.guardianId === me && a.status === 'pending');
  const active = assignments.filter((a) => a.guardianId === me && a.status === 'accepted');
  const watchedOverMe = assignments.filter(
    (a) => a.wardId === me && (a.status === 'accepted' || a.status === 'pending'),
  );
  const history = assignments.filter(
    (a) =>
      (a.guardianId === me || a.wardId === me) &&
      (a.status === 'completed' || a.status === 'declined'),
  );

  const isEmpty =
    requests.length + active.length + watchedOverMe.length + history.length === 0;

  return (
    <Screen contentStyle={{ paddingTop: spacing(2) }}>
      <Text style={styles.heading}>Meine Aufträge</Text>
      <Text style={styles.sub}>Passt aufeinander auf 💜</Text>

      {isEmpty ? (
        <Card style={{ marginTop: spacing(6), alignItems: 'center', paddingVertical: spacing(8) }}>
          <Text style={{ fontSize: 40 }}>🛡️</Text>
          <Text style={styles.emptyTitle}>Noch keine Aufträge</Text>
          <Text style={styles.emptyText}>
            Öffne ein Event und beauftrage einen Buddy, der auf jemanden aufpasst.
          </Text>
        </Card>
      ) : null}

      {requests.length > 0 ? (
        <Section title="🔔 Anfragen an dich">
          {requests.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              role="guardian"
              eventTitle={getEvent(a.eventId)?.title}
              ward={getUser(a.wardId)}
              guardian={getUser(a.guardianId)}
              onPress={() => navigation.navigate('EventDetail', { eventId: a.eventId })}
            >
              <View style={styles.actions}>
                <Button
                  label="Annehmen"
                  variant="success"
                  small
                  onPress={() => respondToAssignment(a.id, true)}
                  style={{ flex: 1 }}
                />
                <Button
                  label="Ablehnen"
                  variant="danger"
                  small
                  onPress={() => respondToAssignment(a.id, false)}
                  style={{ flex: 1 }}
                />
              </View>
            </AssignmentCard>
          ))}
        </Section>
      ) : null}

      {active.length > 0 ? (
        <Section title="🛡️ Du passt auf">
          {active.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              role="guardian"
              eventTitle={getEvent(a.eventId)?.title}
              ward={getUser(a.wardId)}
              guardian={getUser(a.guardianId)}
              onPress={() => navigation.navigate('EventDetail', { eventId: a.eventId })}
            >
              <Button
                label="Als erledigt markieren ✓"
                variant="outline"
                small
                onPress={() => completeAssignment(a.id)}
                style={{ marginTop: spacing(3) }}
              />
            </AssignmentCard>
          ))}
        </Section>
      ) : null}

      {watchedOverMe.length > 0 ? (
        <Section title="💜 Auf dich wird aufgepasst">
          {watchedOverMe.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              role="ward"
              eventTitle={getEvent(a.eventId)?.title}
              ward={getUser(a.wardId)}
              guardian={getUser(a.guardianId)}
              onPress={() => navigation.navigate('EventDetail', { eventId: a.eventId })}
            />
          ))}
        </Section>
      ) : null}

      {history.length > 0 ? (
        <Section title="📜 Verlauf">
          {history.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              role="guardian"
              eventTitle={getEvent(a.eventId)?.title}
              ward={getUser(a.wardId)}
              guardian={getUser(a.guardianId)}
              onPress={() => navigation.navigate('EventDetail', { eventId: a.eventId })}
            />
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing(6) }}>
      <Text style={styles.section}>{title}</Text>
      <View style={{ gap: spacing(3) }}>{children}</View>
    </View>
  );
}

function AssignmentCard({
  assignment,
  role,
  eventTitle,
  ward,
  guardian,
  children,
  onPress,
}: {
  assignment: WatchAssignment;
  role: 'guardian' | 'ward';
  eventTitle?: string;
  ward?: import('../types').User;
  guardian?: import('../types').User;
  children?: React.ReactNode;
  onPress: () => void;
}) {
  const other = role === 'guardian' ? ward : guardian;
  const line =
    role === 'guardian'
      ? `Du passt auf ${ward?.name} auf`
      : `${guardian?.name} passt auf dich auf`;

  return (
    <Card onPress={onPress}>
      <View style={styles.cardTop}>
        <Avatar user={other} size={44} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardLine}>{line}</Text>
          <Text style={styles.cardEvent} numberOfLines={1}>
            🎉 {eventTitle ?? 'Event'} · {formatShortDate(assignment.createdAt)}
          </Text>
        </View>
        <StatusBadge status={assignment.status} />
      </View>
      {assignment.note ? <Text style={styles.note}>„{assignment.note}"</Text> : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: font.h1, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: font.body, marginTop: 2 },
  section: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    marginBottom: spacing(3),
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  cardLine: { color: colors.text, fontSize: 15, fontWeight: '700' },
  cardEvent: { color: colors.textMuted, fontSize: 13, marginTop: 3 },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: spacing(3),
    lineHeight: 18,
  },
  actions: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(4) },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: spacing(3) },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing(2),
    lineHeight: 20,
    maxWidth: 260,
  },
});
