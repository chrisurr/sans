import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Field, GradientButton } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, radius, spacing } from '../theme';
import type { AppStackScreenProps } from '../navigation/types';

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

export function CreateEventScreen({ navigation }: AppStackScreenProps<'CreateEvent'>) {
  const { createEvent } = useApp();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [dayOffset, setDayOffset] = useState(0);
  const [time, setTime] = useState('21:00');
  const [error, setError] = useState<string | null>(null);

  // Die nächsten 14 Tage als auswählbare Chips.
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const onCreate = () => {
    if (!title.trim()) return setError('Bitte gib einen Titel ein.');
    if (!location.trim()) return setError('Bitte gib einen Ort ein.');

    const d = new Date(days[dayOffset]);
    const [h, m] = time.split(':').map(Number);
    d.setHours(h, m, 0, 0);

    const event = createEvent({
      title,
      location,
      description,
      date: d.toISOString(),
    });
    // Liste ersetzen durch das neue Detail.
    navigation.replace('EventDetail', { eventId: event.id });
  };

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
        <Field
          label="Titel"
          placeholder="z. B. Rooftop Party"
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            setError(null);
          }}
        />
        <Field
          label="Ort"
          placeholder="z. B. Skybar, Dachterrasse"
          value={location}
          onChangeText={(t) => {
            setLocation(t);
            setError(null);
          }}
        />

        <Text style={styles.label}>Tag</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {days.map((d, i) => {
            const active = i === dayOffset;
            return (
              <Pressable
                key={i}
                onPress={() => setDayOffset(i)}
                style={[styles.dayChip, active && styles.dayChipActive]}
              >
                <Text style={[styles.dayWeek, active && styles.dayTextActive]}>
                  {i === 0 ? 'Heute' : i === 1 ? 'Morgen' : WEEKDAYS[d.getDay()]}
                </Text>
                <Text style={[styles.dayNum, active && styles.dayTextActive]}>{d.getDate()}</Text>
                <Text style={[styles.dayMonth, active && styles.dayTextActive]}>
                  {MONTHS[d.getMonth()]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.label, { marginTop: spacing(5) }]}>Uhrzeit</Text>
        <View style={styles.timeRow}>
          {TIMES.map((t) => {
            const active = t === time;
            return (
              <Pressable
                key={t}
                onPress={() => setTime(t)}
                style={[styles.timeChip, active && styles.timeChipActive]}
              >
                <Text style={[styles.timeText, active && styles.dayTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: spacing(6) }}>
          <Field
            label="Beschreibung (optional)"
            placeholder="Worum geht's? Dresscode, Motto, …"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>

        {error ? <Text style={styles.error}>⚠️  {error}</Text> : null}

        <GradientButton
          label="Event erstellen"
          icon="🎉"
          onPress={onCreate}
          style={{ marginTop: spacing(2) }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(5), paddingBottom: spacing(12) },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: spacing(2) },
  chipRow: { gap: spacing(2), paddingVertical: spacing(1) },
  dayChip: {
    width: 64,
    paddingVertical: spacing(3),
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayWeek: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  dayNum: { color: colors.text, fontSize: 20, fontWeight: '800', marginVertical: 2 },
  dayMonth: { color: colors.textFaint, fontSize: 11 },
  dayTextActive: { color: colors.white },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  timeChip: {
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(2.5),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  error: { color: colors.danger, fontSize: 13, marginTop: spacing(4) },
});
