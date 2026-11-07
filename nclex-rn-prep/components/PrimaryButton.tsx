import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing } from '@/constants/theme';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'navy';
};

export const PrimaryButton = forwardRef<React.ElementRef<typeof Pressable>, Props>(
  function PrimaryButton({ label, variant = 'primary', disabled, style, ...rest }, ref) {
    const scheme = useColorScheme();
    const colors = Colors[scheme];

    let backgroundColor = colors.tint;
    let textColor = '#FFFFFF';
    let borderColor = 'transparent';
    let useShadow = true;

    if (variant === 'secondary') {
      backgroundColor = colors.surface;
      textColor = colors.navy;
      borderColor = colors.borderStrong;
      useShadow = true;
    } else if (variant === 'ghost') {
      backgroundColor = 'transparent';
      textColor = colors.tint;
      borderColor = 'transparent';
      useShadow = false;
    } else if (variant === 'navy') {
      backgroundColor = colors.navy;
      textColor = '#FFFFFF';
      borderColor = 'transparent';
      useShadow = true;
    }

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        disabled={disabled}
        style={(state) => [
          styles.base,
          useShadow ? shadow.soft : null,
          {
            backgroundColor,
            borderColor,
            opacity: disabled ? 0.45 : state.pressed ? 0.88 : 1,
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
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
