import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Variant = 'solid' | 'outline' | 'ghost' | 'danger' | 'success';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: string;
  small?: boolean;
  style?: ViewStyle;
};

/** Sekundär-Button mit mehreren Varianten. */
export function Button({ label, onPress, variant = 'outline', disabled, icon, small, style }: Props) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: small ? 40 : 50,
          paddingHorizontal: small ? spacing(4) : spacing(5),
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: v.text, fontSize: small ? 14 : 15 }]}>
        {icon ? `${icon}  ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; border: string; text: string }> = {
  solid: { bg: colors.primary, border: colors.primary, text: colors.white },
  outline: { bg: 'transparent', border: colors.border, text: colors.text },
  ghost: { bg: 'transparent', border: 'transparent', text: colors.textMuted },
  danger: { bg: 'transparent', border: colors.danger, text: colors.danger },
  success: { bg: 'transparent', border: colors.success, text: colors.success },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontWeight: '600' },
});
