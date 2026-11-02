import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/context/ProgressContext';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import { FLASHCARDS } from '@/data/flashcards';
import { QUESTIONS } from '@/data/questions';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { stats, ready } = useProgress();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.brand, { color: colors.tint }]}>NCLEX RN Prep</Text>
        <Text style={[styles.headline, { color: colors.text }]}>
          Practice calmly. Build clinical judgment.
        </Text>
        <Text style={[styles.support, { color: colors.textSecondary }]}>
          Offline sample questions, flashcards, and local progress tracking — a clean starter for
          RN exam study.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/practice" asChild>
          <PrimaryButton label="Start practice" />
        </Link>
        <Link href="/flashcards" asChild>
          <PrimaryButton label="Review flashcards" variant="secondary" />
        </Link>
        <Link href="/progress" asChild>
          <PrimaryButton label="View progress" variant="ghost" />
        </Link>
      </View>

      <View style={[styles.metaRow, { borderColor: colors.border }]}>
        <MetaStat label="Questions" value={String(QUESTIONS.length)} colors={colors} />
        <MetaStat label="Flashcards" value={String(FLASHCARDS.length)} colors={colors} />
        <MetaStat
          label="Accuracy"
          value={
            !ready || stats.accuracyPercent === null ? '—' : `${stats.accuracyPercent}%`
          }
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

function MetaStat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={[styles.metaItem, { backgroundColor: colors.surface }]}>
      <Text style={[styles.metaValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  hero: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headline: {
    ...typography.title,
  },
  support: {
    ...typography.body,
  },
  actions: {
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  metaLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
});
