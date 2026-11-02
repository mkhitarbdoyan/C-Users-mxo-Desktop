import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SystemChip } from '@/components/SystemChip';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import { FLASHCARDS } from '@/data/flashcards';

export default function FlashcardsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = FLASHCARDS[index];

  const go = useCallback((delta: number) => {
    setFlipped(false);
    setIndex((current) => {
      const next = current + delta;
      if (next < 0) return FLASHCARDS.length - 1;
      if (next >= FLASHCARDS.length) return 0;
      return next;
    });
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.counter, { color: colors.textSecondary }]}>
        Card {index + 1} of {FLASHCARDS.length}
      </Text>
      <SystemChip system={card.system} />

      <Pressable
        onPress={() => setFlipped((f) => !f)}
        style={[
          styles.card,
          {
            backgroundColor: flipped ? colors.accentSoft : colors.surface,
            borderColor: colors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={flipped ? 'Show term' : 'Show definition'}
      >
        <Text style={[styles.sideLabel, { color: colors.tint }]}>
          {flipped ? 'Definition' : 'Concept'}
        </Text>
        <Text style={[styles.cardText, { color: colors.text }]}>
          {flipped ? card.back : card.front}
        </Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>Tap to flip</Text>
      </Pressable>

      <View style={styles.nav}>
        <PrimaryButton label="Previous" variant="secondary" onPress={() => go(-1)} style={styles.navBtn} />
        <PrimaryButton label="Next" onPress={() => go(1)} style={styles.navBtn} />
      </View>
      <PrimaryButton
        label={flipped ? 'Show front' : 'Show back'}
        variant="ghost"
        onPress={() => setFlipped((f) => !f)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  counter: {
    ...typography.caption,
    fontWeight: '600',
  },
  card: {
    flex: 1,
    minHeight: 280,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.lg,
    ...shadow.card,
  },
  sideLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardText: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '600',
  },
  hint: {
    ...typography.caption,
  },
  nav: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navBtn: {
    flex: 1,
  },
});
