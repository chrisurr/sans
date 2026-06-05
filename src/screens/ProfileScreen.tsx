import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Card, Screen } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import type { TabScreenProps } from '../navigation/types';

export function ProfileScreen(_props: TabScreenProps<'Profile'>) {
  const { currentUser, events, assignments, logout } = useApp();
  if (!currentUser) return null;
  const me = currentUser.id;

  const attending = events.filter((e) => e.attendeeIds.includes(me)).length;
  const guarding = assignments.filter(
    (a) => a.guardianId === me && (a.status === 'accepted' || a.status === 'pending'),
  ).length;
  const watched = assignments.filter((a) => a.wardId === me).length;

  return (
    <Screen contentStyle={{ paddingTop: spacing(2) }}>
      <View style={styles.header}>
        <Avatar user={currentUser} size={92} />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
      </View>

      <View style={styles.stats}>
        <Stat value={attending} label="Events" />
        <Stat value={guarding} label="Passt auf" />
        <Stat value={watched} label="Betreut" />
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🛡️ Sicher feiern</Text>
        <Text style={styles.infoText}>
          sa&apos;ns hilft euch, im Trubel aufeinander aufzupassen. Beauftragt für jede Party einen
          Buddy, der auf Freund:innen achtet, die alleine unterwegs sind.
        </Text>
      </Card>

      <Card style={styles.protoCard}>
        <Text style={styles.protoText}>
          ℹ️ Dies ist ein klickbarer Prototyp. Daten werden nur lokal auf diesem Gerät gehalten und
          beim Neustart zurückgesetzt.
        </Text>
      </Card>

      <Button
        label="Abmelden"
        variant="danger"
        icon="↩"
        onPress={logout}
        style={{ marginTop: spacing(6) }}
      />
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing(4), marginBottom: spacing(6) },
  name: { color: colors.text, fontSize: font.h1, fontWeight: '800', marginTop: spacing(3) },
  email: { color: colors.textMuted, fontSize: font.body, marginTop: 2 },
  stats: { flexDirection: 'row', gap: spacing(3) },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing(4),
    alignItems: 'center',
  },
  statValue: { color: colors.pink, fontSize: 26, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  infoCard: { marginTop: spacing(5) },
  infoTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing(2) },
  infoText: { color: colors.textMuted, fontSize: 14, lineHeight: 21 },
  protoCard: { marginTop: spacing(4), backgroundColor: colors.bgElevated },
  protoText: { color: colors.textFaint, fontSize: 13, lineHeight: 19 },
});
