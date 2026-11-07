import { Image, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';

type Props = {
  uri?: string | null;
  caption?: string;
};

/** Remote clinical image for exam items (optional). */
export function QuestionImage({ uri, caption = 'Clinical image' }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  if (!uri) return null;

  return (
    <View style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" accessibilityLabel={caption} />
      <Text style={[styles.caption, { color: colors.textMuted }]}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: radii.lg,
    overflow: 'hidden',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#E8EEF5',
  },
  caption: {
    ...typography.caption,
    paddingHorizontal: spacing.md,
  },
});
