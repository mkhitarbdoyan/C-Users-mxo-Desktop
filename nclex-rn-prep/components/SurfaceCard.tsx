import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing } from '@/constants/theme';

type Props = ViewProps & {
  children: ReactNode;
  padded?: boolean;
};

/** Soft white floating card — Archer-style surface chrome. */
export function SurfaceCard({ children, padded = true, style, ...rest }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View
      style={[
        styles.card,
        shadow.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: padded ? spacing.xl : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
  },
});
