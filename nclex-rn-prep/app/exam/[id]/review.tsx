import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';
import { endExam, getExam, type ExamSessionView } from '@/lib/api/exams';

export default function ExamReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [exam, setExam] = useState<ExamSessionView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setExam(await getExam(id));
  }, [id]);

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, [load]);

  const onSubmit = async () => {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await endExam(id);
      router.replace(`/exam/${id}/results`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit exam');
    } finally {
      setBusy(false);
    }
  };

  if (!exam) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  const unanswered = new Set(exam.review.unanswered);
  const flagged = new Set(exam.review.flagged);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.navy }]}>Review before submit</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Jump back to flagged or unanswered items, then submit for your score report.
      </Text>

      <SurfaceCard>
        <Text style={[styles.meta, { color: colors.navy }]}>
          Unanswered: {exam.review.unanswered.length} · Flagged: {exam.review.flagged.length}
        </Text>
      </SurfaceCard>

      <View style={styles.list}>
        {exam.items.map((item) => {
          const tags: string[] = [];
          if (unanswered.has(item.questionId)) tags.push('Unanswered');
          if (flagged.has(item.questionId)) tags.push('Flagged');
          if (item.selectedIndex !== null) tags.push(`Chose ${String.fromCharCode(65 + item.selectedIndex)}`);
          return (
            <Pressable
              key={item.questionId}
              onPress={() => router.push(`/exam/${exam.id}`)}
              style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Text style={[styles.rowTitle, { color: colors.navy }]}>
                Q{item.orderIndex + 1}
              </Text>
              <Text style={[styles.rowMeta, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.question.stem}
              </Text>
              <Text style={[styles.tags, { color: colors.tint }]}>{tags.join(' · ') || 'Answered'}</Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}

      <PrimaryButton
        label={busy ? 'Submitting…' : 'Submit exam'}
        disabled={busy}
        onPress={onSubmit}
      />
      <PrimaryButton
        label="Back to questions"
        variant="ghost"
        onPress={() => router.push(`/exam/${exam.id}`)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.title },
  subtitle: { ...typography.body, marginTop: -spacing.sm },
  meta: { ...typography.body, fontWeight: '600' },
  list: { gap: spacing.sm },
  row: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: 4,
  },
  rowTitle: { fontWeight: '700' },
  rowMeta: { ...typography.caption },
  tags: { ...typography.caption, fontWeight: '700', marginTop: 4 },
});
