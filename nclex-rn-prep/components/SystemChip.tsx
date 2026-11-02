import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { radii, spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import type { NursingSystem } from '@/types';

const LABELS: Record<NursingSystem, string> = {
  'med-surg': 'Med-Surg',
  pharmacology: 'Pharmacology',
  maternity: 'Maternity',
  psychiatric: 'Psychiatric',
  fundamentals: 'Fundamentals',
};

export function SystemChip({ system }: { system: NursingSystem }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={[styles.chip, { backgroundColor: colors.chip, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.tint }]}>{LABELS[system]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
