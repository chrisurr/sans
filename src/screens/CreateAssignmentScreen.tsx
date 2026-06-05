import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Avatar, Field, GradientButton } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import type { User } from '../types';
import type { AppStackScreenProps } from '../navigation/types';

export function CreateAssignmentScreen({ route, navigation }: AppStackScreenProps<'CreateAssignment'>) {
  const { eventId, wardId: initialWard } = route.params;
  const { getEvent, getUser, currentUser, createAssignment } = useApp();

  const event = getEvent(eventId);
  const attendees = (event?.attendeeIds.map(getUser).filter(Boolean) as User[]) ?? [];

  const [wardId, setWardId] = useState<string | null>(initialWard ?? null);
  const [guardianId, setGuardianId] = useState<string | null>(currentUser?.id ?? null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onCreate = () => {
    if (!wardId) return setError('Bitte wähle die Person, auf die aufgepasst werden soll.');
    if (!guardianId) return setError('Bitte wähle einen Aufpasser.');
    if (wardId === guardianId) return setError('Aufpasser und betreute Person müssen verschieden sein.');

    createAssignment({ eventId, wardId, guardianId, note });
    navigation.goBack();
  };

  if (!event) {
    return (
      <View style={styles.flex}>
        <Text style={styles.fallback}>Event nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lead}>
          Sorge dafür, dass niemand alleine bleibt. Wähle eine Person und einen Buddy, der auf sie
          aufpasst.
        </Text>

        <Text style={styles.step}>1 · Wer ist alleine? 💜</Text>
        <PersonGrid
          people={attendees}
          selectedId={wardId}
          onSelect={(id) => {
            setWardId(id);
            setError(null);
          }}
        />

        <Text style={styles.step}>2 · Wer passt auf? 🛡️</Text>
        <PersonGrid
          people={attendees}
          selectedId={guardianId}
          disabledId={wardId}
          currentUserId={currentUser?.id}
          onSelect={(id) => {
            setGuardianId(id);
            setError(null);
          }}
        />

        <View style={{ marginTop: spacing(6) }}>
          <Field
            label="3 · Notiz an den Buddy (optional)"
            placeholder="z. B. Bring sie sicher zum Taxi."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={{ height: 84, textAlignVertical: 'top' }}
          />
        </View>

        {error ? <Text style={styles.error}>⚠️  {error}</Text> : null}

        <GradientButton
          label="Auftrag senden"
          icon="🛡️"
          onPress={onCreate}
          style={{ marginTop: spacing(2) }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PersonGrid({
  people,
  selectedId,
  disabledId,
  currentUserId,
  onSelect,
}: {
  people: User[];
  selectedId: string | null;
  disabledId?: string | null;
  currentUserId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {people.map((u) => {
        const selected = u.id === selectedId;
        const disabled = u.id === disabledId;
        return (
          <Pressable
            key={u.id}
            disabled={disabled}
            onPress={() => onSelect(u.id)}
            style={[
              styles.personCard,
              selected && styles.personCardActive,
              disabled && styles.personCardDisabled,
            ]}
          >
            <Avatar user={u} size={44} />
            <Text style={[styles.personName, selected && { color: colors.white }]} numberOfLines={1}>
              {u.id === currentUserId ? `${u.name} (du)` : u.name}
            </Text>
            {selected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(5), paddingBottom: spacing(12) },
  fallback: { color: colors.textMuted, marginTop: spacing(10), textAlign: 'center' },
  lead: { color: colors.textMuted, fontSize: font.body, lineHeight: 21, marginBottom: spacing(4) },
  step: {
    color: colors.text,
    fontSize: font.h3,
    fontWeight: '700',
    marginTop: spacing(5),
    marginBottom: spacing(3),
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  personCard: {
    width: '31.5%',
    alignItems: 'center',
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(1),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing(2),
  },
  personCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  personCardDisabled: { opacity: 0.3 },
  personName: { color: colors.text, fontSize: 13, fontWeight: '600', maxWidth: '100%' },
  check: { position: 'absolute', top: 6, right: 8, color: colors.white, fontWeight: '800' },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing(4) },
});
