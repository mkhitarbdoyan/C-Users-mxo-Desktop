import { Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ExamLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.navy,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="[id]/index" options={{ title: 'Exam' }} />
      <Stack.Screen name="[id]/review" options={{ title: 'Review' }} />
      <Stack.Screen name="[id]/results" options={{ title: 'Results' }} />
    </Stack>
  );
}
