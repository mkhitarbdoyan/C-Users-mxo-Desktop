import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';

type Chip = { id: string; label: string };

type Props = {
  label: string;
  chips: Chip[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function FilterChipRow({ label, chips, selected, onChange }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const allActive = selected.length === 0;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pressable
          onPress={() => onChange([])}
          style={[
            styles.chip,
            {
              backgroundColor: allActive ? colors.tint : colors.surface,
              borderColor: allActive ? colors.tint : colors.borderStrong,
            },
          ]}
        >
          <Text style={[styles.chipText, { color: allActive ? '#FFFFFF' : colors.navy }]}>All</Text>
        </Pressable>
        {chips.map((chip) => {
          const active = selected.includes(chip.id);
          return (
            <Pressable
              key={chip.id}
              onPress={() => toggle(chip.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.tint : colors.surface,
                  borderColor: active ? colors.tint : colors.borderStrong,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? '#FFFFFF' : colors.navy }]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { ...typography.caption, fontWeight: '700' },
  row: { gap: spacing.sm, paddingVertical: 2 },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
});
