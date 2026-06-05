import { LinearGradient } from 'expo-linear-gradient';
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
import { DEMO_PASSWORD, useApp } from '../context/AppContext';
import { colors, font, gradients, radius, spacing } from '../theme';
import type { AuthStackScreenProps } from '../navigation/types';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { login, loginAs, users } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onLogin = () => {
    const res = login(email, password);
    if (!res.ok) setError(res.error);
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
        <View style={styles.header}>
          <LinearGradient colors={gradients.brand} style={styles.logo}>
            <Text style={styles.logoEmoji}>🛡️</Text>
          </LinearGradient>
          <Text style={styles.title}>{"sa'ns"}</Text>
          <Text style={styles.subtitle}>
            Feiern gehen – und sicher aufeinander aufpassen.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            label="E-Mail"
            placeholder="du@beispiel.de"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Field
            label="Passwort"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError(null);
            }}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>⚠️  {error}</Text> : null}

          <GradientButton label="Einloggen" onPress={onLogin} style={{ marginTop: spacing(2) }} />

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkRow}>
            <Text style={styles.linkMuted}>Noch kein Konto? </Text>
            <Text style={styles.link}>Registrieren</Text>
          </Pressable>
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>⚡ Schnell ausprobieren</Text>
          <Text style={styles.demoHint}>
            Tippe auf einen Demo-Account – oder logge dich manuell ein (Passwort:{' '}
            <Text style={styles.code}>{DEMO_PASSWORD}</Text>).
          </Text>
          <View style={styles.chips}>
            {users.map((u) => (
              <Pressable key={u.id} onPress={() => loginAs(u.id)} style={styles.chip}>
                <Avatar user={u} size={28} />
                <Text style={styles.chipText}>{u.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(6), paddingTop: spacing(16) },
  header: { alignItems: 'center', marginBottom: spacing(8) },
  logo: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing(4),
  },
  logoEmoji: { fontSize: 42 },
  title: { color: colors.text, fontSize: font.h1, fontWeight: '800', letterSpacing: 0.5 },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.body,
    textAlign: 'center',
    marginTop: spacing(2),
    maxWidth: 280,
  },
  form: { marginBottom: spacing(8) },
  error: { color: colors.danger, fontSize: 13, marginBottom: spacing(2) },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing(5) },
  linkMuted: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.pink, fontSize: 14, fontWeight: '700' },
  demoBox: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing(4),
  },
  demoTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: spacing(2) },
  demoHint: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: spacing(4) },
  code: { color: colors.accent, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(3),
  },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
