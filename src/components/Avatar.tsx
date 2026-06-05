import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';
import { User } from '../types';

type Props = {
  user?: User;
  size?: number;
  ring?: boolean;
};

/** Runder Avatar mit Emoji und farbigem Rahmen. */
export function Avatar({ user, size = 44, ring = true }: Props) {
  const inner = size - (ring ? 4 : 0);
  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ring ? user?.color ?? colors.border : 'transparent',
          borderWidth: ring ? 2 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          { width: inner, height: inner, borderRadius: inner / 2 },
        ]}
      >
        <Text style={{ fontSize: inner * 0.5 }}>{user?.emoji ?? '👤'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
  },
});
