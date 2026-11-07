import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

type Tone = 'teal' | 'cyan' | 'purple' | 'success';

const TONE_KEYS: Record<Tone, keyof (typeof Colors)['light']> = {
  teal: 'accentSoft',
  cyan: 'iconCircle',
  purple: 'iconCircleAlt',
  success: 'successBg',
};

/** Circular accent chip for metrics / section icons. */
export function IconBadge({
  children,
  tone = 'cyan',
  size = 44,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: number;
}) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors[TONE_KEYS[tone]],
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
