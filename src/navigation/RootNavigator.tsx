import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { CreateAssignmentScreen } from '../screens/CreateAssignmentScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { colors } from '../theme';
import { AuthStack } from './AuthStack';
import { TabsNavigator } from './TabsNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.pink,
    notification: colors.pink,
  },
};

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event', headerBackTitle: 'Zurück' }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Neues Event', presentation: 'modal' }}
      />
      <Stack.Screen
        name="CreateAssignment"
        component={CreateAssignmentScreen}
        options={{ title: 'Aufpasser beauftragen', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { ready, currentUser } = useApp();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.pink} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
