import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { NURSING_SYSTEM_LABELS } from '@/constants/nursingSystems';
import { spacing, typography } from '@/constants/theme';
import { endExam, type ExamReport } from '@/lib/api/exams';
import type { NursingSystem } from '@/types';

export default function ExamResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [report, setReport] = useState<ExamReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    endExam(id)
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load report'));
  }, [id]);

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.navy }]}>Exam score report</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Submitted {new Date(report.submittedAt).toLocaleString()}
      </Text>

      <SurfaceCard>
        <Text style={[styles.score, { color: colors.navy }]}>
          {report.scoreCorrect}/{report.scoreTotal} · {report.percent}%
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          Unanswered {report.unansweredCount} · Flagged {report.flaggedCount}
        </Text>
      </SurfaceCard>

      <Text style={[styles.section, { color: colors.navy }]}>By category</Text>
      {Object.entries(report.bySystem).map(([system, stats]) => (
        <SurfaceCard key={system}>
          <Text style={[styles.rowTitle, { color: colors.navy }]}>
            {NURSING_SYSTEM_LABELS[system as NursingSystem] ?? system}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {stats.correct}/{stats.total} correct
          </Text>
        </SurfaceCard>
      ))}

      <Text style={[styles.section, { color: colors.navy }]}>Item review</Text>
      {report.items.map((item) => (
        <SurfaceCard key={item.questionId} style={{ gap: spacing.sm }}>
          <Text style={[styles.rowTitle, { color: colors.navy }]}>
            Q{item.orderIndex + 1} · {item.correct ? 'Correct' : 'Incorrect'}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{item.question.stem}</Text>
          {item.aiExplanation ? (
            <Text style={[styles.meta, { color: colors.navy }]}>{item.aiExplanation}</Text>
          ) : null}
        </SurfaceCard>
      ))}

      <PrimaryButton label="Back to exam lobby" onPress={() => router.replace('/(tabs)/exam')} />
      <PrimaryButton label="Home" variant="ghost" onPress={() => router.replace('/(tabs)')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.title },
  subtitle: { ...typography.body, marginTop: -spacing.sm },
  score: { fontSize: 28, fontWeight: '700' },
  meta: { ...typography.body },
  section: { ...typography.heading, marginTop: spacing.sm },
  rowTitle: { fontWeight: '700', fontSize: 15 },
});
