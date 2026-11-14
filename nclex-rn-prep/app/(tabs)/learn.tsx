import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import { TOPIC_GUIDES } from '@/data/topics';

export default function LearnHubScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.navy }]}>Topics</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Short clinical shortcuts by category — diseases, key cues, and priority nursing actions.
      </Text>

      <View style={styles.list}>
        {TOPIC_GUIDES.map((topic) => (
          <Link key={topic.id} href={`/learn/${topic.id}`} asChild>
            <Pressable
              style={({ pressed }) => [
                styles.row,
                shadow.soft,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${topic.label} topic guide`}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.navy }]}>{topic.label}</Text>
                <Text style={[styles.rowBlurb, { color: colors.textSecondary }]}>{topic.blurb}</Text>
                <Text style={[styles.rowMeta, { color: colors.tint }]}>
                  {topic.conditions.length} condition
                  {topic.conditions.length === 1 ? '' : 's'}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <SurfaceCard>
        <Text style={[styles.hintTitle, { color: colors.navy }]}>Study tip</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Skim a topic before Practice or Exam, then filter questions by the same category.
        </Text>
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.sm },
  row: {
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: { flex: 1, gap: 4 },
  rowTitle: { fontSize: 17, fontWeight: '700' },
  rowBlurb: { ...typography.caption, lineHeight: 18 },
  rowMeta: { ...typography.caption, fontWeight: '700', marginTop: 4 },
  chevron: { fontSize: 28, fontWeight: '300', marginTop: -4 },
  hintTitle: { ...typography.heading, marginBottom: spacing.sm },
});
