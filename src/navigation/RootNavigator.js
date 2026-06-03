import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import TabsNavigator from './TabsNavigator';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

import { hydrateAuth } from '../redux/authSlice';
import { hydrateSettings } from '../redux/settingsSlice';
import { hydrateTasks } from '../redux/tasksSlice';

const Stack = createNativeStackNavigator();

const navTheme = {
  dark: true,
  colors: {
    primary: '#7C5CFF',
    background: '#0A0A0F',
    card: '#0A0A0F',
    text: '#F5F5FA',
    border: 'rgba(255,255,255,0.06)',
    notification: '#FF6BCB',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

const RootNavigator = () => {
  const dispatch = useDispatch();
  const { user, onboarded, hydrated: authHydrated } = useSelector((s) => s.auth);
  const tasksHydrated = useSelector((s) => s.tasks.hydrated);

  useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(hydrateSettings());
    dispatch(hydrateTasks());
  }, [dispatch]);

  const ready = authHydrated && tasksHydrated;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      >
        {!ready ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabsNavigator} />
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
