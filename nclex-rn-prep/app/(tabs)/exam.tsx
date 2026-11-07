import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { spacing, typography } from '@/constants/theme';
import { startExam } from '@/lib/api/exams';

export default function ExamLobbyScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = async (questionCount: number, durationMinutes: number) => {
    setError(null);
    setBusy(true);
    try {
      const exam = await startExam({ questionCount, durationMinutes });
      router.push(`/exam/${exam.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start exam');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.navy }]}>Exam mode</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Timed NCLEX-style practice with flagging, review before submit, a score report, and AI
        explanations after each answer.
      </Text>

      <SurfaceCard style={{ gap: spacing.sm }}>
        <Text style={[styles.cardTitle, { color: colors.navy }]}>How it works</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Questions are drawn from the backend bank with a mix of categories and difficulty. The
          timer runs for the whole session. Flag items to revisit, review unanswered or flagged
          questions, then submit for your score.
        </Text>
      </SurfaceCard>

      <SurfaceCard style={{ gap: spacing.md }}>
        <Text style={[styles.cardTitle, { color: colors.navy }]}>Start an exam</Text>
        <PrimaryButton
          label={busy ? 'Starting…' : 'Quick exam — 10 Q · 20 min'}
          disabled={busy}
          onPress={() => onStart(10, 20)}
        />
        <PrimaryButton
          label={busy ? 'Starting…' : 'Longer exam — 12 Q · 30 min'}
          variant="secondary"
          disabled={busy}
          onPress={() => onStart(12, 30)}
        />
        {busy ? <ActivityIndicator color={colors.tint} /> : null}
        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
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
  subtitle: { ...typography.body, marginTop: -spacing.sm },
  cardTitle: { ...typography.heading },
  body: { ...typography.body },
  error: { ...typography.caption, fontWeight: '700' },
});
