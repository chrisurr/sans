import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  /** Untere Safe-Area + Tab-Bar berücksichtigen. */
  pad?: boolean;
  contentStyle?: ViewStyle;
};

/** Bildschirm-Wrapper mit Hintergrund und Safe-Area-Abständen. */
export function Screen({ children, scroll = true, pad = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = {
    paddingHorizontal: pad ? spacing(5) : 0,
    paddingBottom: spacing(6) + insets.bottom,
  };

  if (scroll) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={[padding, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.root, padding, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
