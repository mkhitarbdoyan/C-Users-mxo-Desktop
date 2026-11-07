import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { SystemChip } from '@/components/SystemChip';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/context/ProgressContext';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import { QUESTIONS } from '@/data/questions';

export default function PracticeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { recordAnswer, endSession, openSessionAttempts } = useProgress();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question = QUESTIONS[index];
  const isCorrect = selected !== null && selected === question.correctIndex;

  const progressLabel = useMemo(
    () => `Question ${index + 1} of ${QUESTIONS.length}`,
    [index]
  );

  const resetSelection = useCallback(() => {
    setSelected(null);
    setSubmitted(false);
  }, []);

  const onSubmit = useCallback(async () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    await recordAnswer({
      questionId: question.id,
      selectedIndex: selected,
      correct: selected === question.correctIndex,
    });
  }, [question.correctIndex, question.id, recordAnswer, selected, submitted]);

  const onNext = useCallback(async () => {
    const isLast = index >= QUESTIONS.length - 1;
    if (isLast) {
      await endSession();
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    resetSelection();
  }, [endSession, index, resetSelection]);

  const progressRatio = (index + (submitted ? 1 : 0)) / QUESTIONS.length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.topMeta}>
        <Text style={[styles.progress, { color: colors.textMuted }]}>{progressLabel}</Text>
        <SystemChip system={question.system} />
      </View>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.trackFill,
            { width: `${Math.min(100, Math.round(progressRatio * 100))}%`, backgroundColor: colors.tint },
          ]}
        />
      </View>

      <SurfaceCard>
        <Text style={[styles.stem, { color: colors.navy }]}>{question.stem}</Text>
      </SurfaceCard>

      <View style={styles.choices}>
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const showResult = submitted;
          let borderColor = colors.border;
          let backgroundColor = colors.surface;
          let letterBg = colors.accentSoft;
          let letterColor = colors.tint;

          if (showResult && i === question.correctIndex) {
            borderColor = colors.success;
            backgroundColor = colors.successBg;
            letterBg = colors.success;
            letterColor = '#FFFFFF';
          } else if (showResult && isSelected && !isCorrect) {
            borderColor = colors.error;
            backgroundColor = colors.errorBg;
            letterBg = colors.error;
            letterColor = '#FFFFFF';
          } else if (isSelected) {
            borderColor = colors.tint;
            backgroundColor = colors.accentSoft;
            letterBg = colors.tint;
            letterColor = '#FFFFFF';
          }

          return (
            <Pressable
              key={`${question.id}-${i}`}
              disabled={submitted}
              onPress={() => setSelected(i)}
              style={[styles.choice, shadow.soft, { borderColor, backgroundColor }]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={[styles.choiceLetterWrap, { backgroundColor: letterBg }]}>
                <Text style={[styles.choiceLetter, { color: letterColor }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.choiceText, { color: colors.navy }]}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>

      {submitted ? (
        <SurfaceCard
          style={{
            backgroundColor: isCorrect ? colors.successBg : colors.errorBg,
            borderColor: isCorrect ? colors.success : colors.error,
          }}
        >
          <Text
            style={[
              styles.rationaleTitle,
              { color: isCorrect ? colors.success : colors.error },
            ]}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Text>
          <Text style={[styles.rationaleBody, { color: colors.navy }]}>{question.rationale}</Text>
        </SurfaceCard>
      ) : null}

      <View style={styles.actions}>
        {!submitted ? (
          <PrimaryButton label="Check answer" onPress={onSubmit} disabled={selected === null} />
        ) : (
          <PrimaryButton
            label={index >= QUESTIONS.length - 1 ? 'Finish & restart' : 'Next question'}
            onPress={onNext}
          />
        )}
        {openSessionAttempts.length > 0 ? (
          <Text style={[styles.sessionHint, { color: colors.textMuted }]}>
            Session answers: {openSessionAttempts.length}
          </Text>
        ) : null}
      </View>
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
  topMeta: {
    gap: spacing.sm,
  },
  progress: {
    ...typography.caption,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  stem: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '600',
  },
  choices: {
    gap: spacing.sm,
  },
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
  choiceLetter: {
    fontWeight: '700',
    fontSize: 14,
  },
  choiceText: {
    flex: 1,
    ...typography.body,
  },
  rationaleTitle: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  rationaleBody: {
    ...typography.body,
  },
  actions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  sessionHint: {
    ...typography.caption,
    textAlign: 'center',
  },
});
