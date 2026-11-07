import { Redirect, Stack } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

export default function AuthLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, session } = useAuth();

  if (ready && session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
    </Stack>
  );
}
