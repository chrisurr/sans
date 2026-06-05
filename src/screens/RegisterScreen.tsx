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
import { Field, GradientButton } from '../components';
import { useApp } from '../context/AppContext';
import { colors, font, spacing } from '../theme';
import type { AuthStackScreenProps } from '../navigation/types';

export function RegisterScreen({ navigation }: AuthStackScreenProps<'Register'>) {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onRegister = () => {
    const res = register(name, email, password);
    if (!res.ok) setError(res.error);
    // Bei Erfolg wechselt die Navigation automatisch (currentUser ist gesetzt).
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
        <Text style={styles.title}>Konto erstellen</Text>
        <Text style={styles.subtitle}>Werde Teil der Crew und passt aufeinander auf.</Text>

        <View style={styles.form}>
          <Field
            label="Name"
            placeholder="Wie heißt du?"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setError(null);
            }}
          />
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
          />
          <Field
            label="Passwort"
            placeholder="Mindestens 4 Zeichen"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError(null);
            }}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>⚠️  {error}</Text> : null}

          <GradientButton
            label="Registrieren & loslegen"
            onPress={onRegister}
            style={{ marginTop: spacing(2) }}
          />

          <Pressable onPress={() => navigation.goBack()} style={styles.linkRow}>
            <Text style={styles.linkMuted}>Schon dabei? </Text>
            <Text style={styles.link}>Einloggen</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(6), paddingTop: spacing(14) },
  title: { color: colors.text, fontSize: font.h1, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: font.body, marginTop: spacing(2) },
  form: { marginTop: spacing(8) },
  error: { color: colors.danger, fontSize: 13, marginBottom: spacing(2) },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing(5) },
  linkMuted: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.pink, fontSize: 14, fontWeight: '700' },
});
