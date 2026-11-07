import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionImage } from '@/components/QuestionImage';
import { SurfaceCard } from '@/components/SurfaceCard';
import { SystemChip } from '@/components/SystemChip';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import {
  explainExamAnswer,
  getExam,
  setExamFlag,
  submitExamAnswer,
  type ExamSessionView,
} from '@/lib/api/exams';

function formatRemaining(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ExamSessionScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const [exam, setExam] = useState<ExamSessionView | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explanationImageUrl, setExplanationImageUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

  const load = useCallback(async () => {
    if (!id) return;
    const data = await getExam(id);
    setExam(data);
    setRemaining(data.remainingSec);
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load exam');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  /** Jump from review: /exam/:id?q=<orderIndex> */
  useEffect(() => {
    if (q == null || q === '') return;
    const next = Number(Array.isArray(q) ? q[0] : q);
    if (!Number.isFinite(next) || next < 0) return;
    setIndex(next);
  }, [q]);

  useEffect(() => {
    if (!exam?.items.length) return;
    setIndex((current) => Math.min(current, exam.items.length - 1));
  }, [exam?.items.length]);

  useEffect(() => {
    if (!exam || exam.status !== 'in_progress') return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace(`/exam/${id}/results`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, id]);

  const item = exam?.items[index];

  useEffect(() => {
    if (!item) return;
    setSelected(item.selectedIndex);
    setExplanation(item.aiExplanation);
    setExplanationImageUrl(item.question.imageUrl ?? null);
  }, [item?.questionId]);

  const progressLabel = useMemo(() => {
    if (!exam) return '';
    return `Question ${index + 1} of ${exam.items.length}`;
  }, [exam, index]);

  const onSelect = async (choiceIndex: number) => {
    if (!exam || !item || busy) return;
    setBusy(true);
    setError(null);
    try {
      await submitExamAnswer(exam.id, {
        questionId: item.questionId,
        selectedIndex: choiceIndex,
        flagged: item.flagged,
      });
      setSelected(choiceIndex);
      const explained = await explainExamAnswer(exam.id, item.questionId);
      setExplanation(explained.explanation);
      setExplanationImageUrl(explained.imageUrl ?? item.question.imageUrl ?? null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save answer');
    } finally {
      setBusy(false);
    }
  };

  const onToggleFlag = async () => {
    if (!exam || !item || busy) return;
    setBusy(true);
    try {
      await setExamFlag(exam.id, { questionId: item.questionId, flagged: !item.flagged });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update flag');
    } finally {
      setBusy(false);
    }
  };

  if (error && !exam) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  if (!exam || !item) {
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
      <View style={styles.topRow}>
        <Text style={[styles.progress, { color: colors.textMuted }]}>{progressLabel}</Text>
        <Text style={[styles.timer, { color: remaining < 60 ? colors.error : colors.navy }]}>
          {formatRemaining(remaining)}
        </Text>
      </View>
      <SystemChip system={item.question.system} />

      <SurfaceCard>
        <Text style={[styles.stem, { color: colors.navy }]}>{item.question.stem}</Text>
      </SurfaceCard>

      <QuestionImage uri={item.question.imageUrl} caption="Clinical image for this item" />

      <View style={styles.choices}>
        {item.question.choices.map((choice, i) => {
          const isSelected = selected === i;
          return (
            <Pressable
              key={`${item.questionId}-${i}`}
              disabled={busy}
              onPress={() => onSelect(i)}
              style={[
                styles.choice,
                shadow.soft,
                {
                  borderColor: isSelected ? colors.tint : colors.border,
                  backgroundColor: isSelected ? colors.accentSoft : colors.surface,
                },
              ]}
            >
              <View
                style={[
                  styles.choiceLetterWrap,
                  { backgroundColor: isSelected ? colors.tint : colors.accentSoft },
                ]}
              >
                <Text
                  style={[styles.choiceLetter, { color: isSelected ? '#FFFFFF' : colors.tint }]}
                >
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.choiceText, { color: colors.navy }]}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>

      {explanation ? (
        <SurfaceCard style={{ backgroundColor: colors.backgroundWash, gap: spacing.md }}>
          <Text style={[styles.explainTitle, { color: colors.tint }]}>AI explanation</Text>
          <QuestionImage uri={explanationImageUrl} caption="Image referenced in explanation" />
          <Text style={[styles.explainBody, { color: colors.navy }]}>{explanation}</Text>
        </SurfaceCard>
      ) : null}

      {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}

      <View style={styles.actions}>
        <PrimaryButton
          label={item.flagged ? 'Unflag question' : 'Flag for review'}
          variant="secondary"
          onPress={onToggleFlag}
          disabled={busy}
        />
        <View style={styles.navRow}>
          <PrimaryButton
            label="Previous"
            variant="ghost"
            style={styles.flexBtn}
            disabled={index === 0 || busy}
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
          />
          <PrimaryButton
            label={index >= exam.items.length - 1 ? 'Review' : 'Next'}
            style={styles.flexBtn}
            disabled={busy}
            onPress={() => {
              if (index >= exam.items.length - 1) {
                router.push(`/exam/${exam.id}/review`);
              } else {
                setIndex((i) => i + 1);
              }
            }}
          />
        </View>
        <PrimaryButton
          label="Review before submit"
          variant="ghost"
          onPress={() => router.push(`/exam/${exam.id}/review`)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progress: { ...typography.caption, fontWeight: '600' },
  timer: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  stem: { ...typography.body, fontSize: 17, lineHeight: 26, fontWeight: '600' },
  choices: { gap: spacing.sm },
  choice: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  choiceLetterWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLetter: { fontWeight: '700', fontSize: 14 },
  choiceText: { flex: 1, ...typography.body },
  explainTitle: { fontWeight: '700', marginBottom: spacing.sm },
  explainBody: { ...typography.body },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  navRow: { flexDirection: 'row', gap: spacing.sm },
  flexBtn: { flex: 1 },
});
