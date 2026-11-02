import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
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

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.progress, { color: colors.textSecondary }]}>{progressLabel}</Text>
      <SystemChip system={question.system} />

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.stem, { color: colors.text }]}>{question.stem}</Text>
      </View>

      <View style={styles.choices}>
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const showResult = submitted;
          let borderColor = colors.border;
          let backgroundColor = colors.surface;
          if (showResult && i === question.correctIndex) {
            borderColor = colors.success;
            backgroundColor = colors.successBg;
          } else if (showResult && isSelected && !isCorrect) {
            borderColor = colors.error;
            backgroundColor = colors.errorBg;
          } else if (isSelected) {
            borderColor = colors.tint;
            backgroundColor = colors.accentSoft;
          }

          return (
            <Pressable
              key={`${question.id}-${i}`}
              disabled={submitted}
              onPress={() => setSelected(i)}
              style={[styles.choice, { borderColor, backgroundColor }]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.choiceLetter, { color: colors.tint }]}>
                {String.fromCharCode(65 + i)}
              </Text>
              <Text style={[styles.choiceText, { color: colors.text }]}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>

      {submitted ? (
        <View
          style={[
            styles.rationale,
            {
              backgroundColor: isCorrect ? colors.successBg : colors.errorBg,
              borderColor: isCorrect ? colors.success : colors.error,
            },
          ]}
        >
          <Text
            style={[
              styles.rationaleTitle,
              { color: isCorrect ? colors.success : colors.error },
            ]}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Text>
          <Text style={[styles.rationaleBody, { color: colors.text }]}>{question.rationale}</Text>
        </View>
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
          <Text style={[styles.sessionHint, { color: colors.textSecondary }]}>
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
  progress: {
    ...typography.caption,
    fontWeight: '600',
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    ...shadow.card,
  },
  stem: {
    ...typography.body,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
  },
  choices: {
    gap: spacing.sm,
  },
  choice: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  choiceLetter: {
    fontWeight: '700',
    fontSize: 15,
    width: 20,
  },
  choiceText: {
    flex: 1,
    ...typography.body,
  },
  rationale: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  rationaleTitle: {
    fontWeight: '700',
    fontSize: 15,
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
