import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, statusColors } from '../theme';
import { STATUS_LABEL, WatchStatus } from '../types';

/** Farbiges Badge für den Status eines Aufpass-Auftrags. */
export function StatusBadge({ status }: { status: WatchStatus }) {
  const color = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}66` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '700' },
});
