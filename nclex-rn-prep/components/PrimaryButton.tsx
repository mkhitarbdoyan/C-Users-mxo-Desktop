import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import Colors from '@/constants/Colors';
import { radii, spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const PrimaryButton = forwardRef<React.ElementRef<typeof Pressable>, Props>(
  function PrimaryButton({ label, variant = 'primary', disabled, style, ...rest }, ref) {
    const scheme = useColorScheme();
    const colors = Colors[scheme];

    const backgroundColor =
      variant === 'primary'
        ? colors.tint
        : variant === 'secondary'
          ? colors.accentSoft
          : 'transparent';
    const textColor = variant === 'primary' ? '#FFFFFF' : colors.tint;
    const borderColor = variant === 'ghost' ? colors.border : 'transparent';

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        disabled={disabled}
        style={(state) => [
          styles.base,
          {
            backgroundColor,
            borderColor,
            opacity: disabled ? 0.45 : state.pressed ? 0.85 : 1,
          },
          typeof style === 'function' ? style(state) : style,
        ]}
        {...rest}
      >
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
