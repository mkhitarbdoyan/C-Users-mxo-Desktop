import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { spacing, typography } from '@/constants/theme';
import { getTopicGuide } from '@/data/topics';

export default function TopicDetailScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { category } = useLocalSearchParams<{ category: string }>();
  const guide = typeof category === 'string' ? getTopicGuide(category) : undefined;

  if (!guide) {
    return (
      <View style={[styles.missing, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Topic' }} />
        <Text style={[styles.missingTitle, { color: colors.navy }]}>Topic not found</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Pick a category from Learn to open its quick-reference guide.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: guide.label }} />

      <Text style={[styles.kicker, { color: colors.tint }]}>Quick reference</Text>
      <Text style={[styles.title, { color: colors.navy }]}>{guide.label}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{guide.blurb}</Text>

      {guide.conditions.map((condition) => (
        <SurfaceCard key={condition.id} style={styles.card}>
          <Text style={[styles.conditionName, { color: colors.navy }]}>{condition.name}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{condition.summary}</Text>

          <Text style={[styles.sectionLabel, { color: colors.tint }]}>Key points</Text>
          {condition.keyPoints.map((point) => (
            <Text key={point} style={[styles.bullet, { color: colors.navy }]}>
              • {point}
            </Text>
          ))}

          <Text style={[styles.sectionLabel, { color: colors.tint }]}>Nursing priorities</Text>
          {condition.nursingPriorities.map((point) => (
            <Text key={point} style={[styles.bullet, { color: colors.navy }]}>
              • {point}
            </Text>
          ))}
        </SurfaceCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  missing: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  missingTitle: { ...typography.title },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { ...typography.title },
  subtitle: { ...typography.body, marginBottom: spacing.sm },
  card: { gap: spacing.sm },
  conditionName: { ...typography.heading },
  sectionLabel: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: { ...typography.body },
  bullet: { ...typography.body, lineHeight: 22 },
});
