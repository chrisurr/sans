import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import { User } from '../types';
import { Avatar } from './Avatar';

type Props = {
  users: User[];
  max?: number;
  size?: number;
};

/** Überlappende Teilnehmer-Avatare mit "+N"-Rest. */
export function AvatarStack({ users, max = 4, size = 32 }: Props) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <View style={styles.row}>
      {shown.map((u, i) => (
        <View key={u.id} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar user={u} size={size} />
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={[
            styles.more,
            { width: size, height: size, borderRadius: size / 2, marginLeft: -size * 0.32 },
          ]}
        >
          <Text style={styles.moreText}>+{rest}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.bg,
    borderRadius: radius.pill,
  },
  moreText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
});
