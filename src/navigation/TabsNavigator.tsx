import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { EventsListScreen } from '../screens/EventsListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';
import type { TabsParamList } from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

const ICONS: Record<keyof TabsParamList, string> = {
  Events: '🎉',
  Assignments: '🛡️',
  Profile: '👤',
};

export function TabsNavigator() {
  const { assignments, currentUser } = useApp();
  const pending = assignments.filter(
    (a) => a.guardianId === currentUser?.id && a.status === 'pending',
  ).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused }) => (
          <View>
            <Text style={[styles.icon, { opacity: focused ? 1 : 0.55 }]}>
              {ICONS[route.name]}
            </Text>
            {route.name === 'Assignments' && pending > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pending}</Text>
              </View>
            ) : null}
          </View>
        ),
      })}
    >
      <Tab.Screen name="Events" component={EventsListScreen} options={{ title: 'Events' }} />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{ title: 'Aufträge' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bgElevated,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 86,
    paddingTop: 8,
    paddingBottom: 28,
  },
  label: { fontSize: 11, fontWeight: '600' },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
});
