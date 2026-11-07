import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

/** Entry redirect — signed-in users go to tabs; others to login. */
export default function Index() {
  const { ready, session } = useAuth();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
