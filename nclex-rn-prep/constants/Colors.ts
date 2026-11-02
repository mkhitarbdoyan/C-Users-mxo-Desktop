/**
 * Calm clinical palette — soft blues/teals with readable contrast.
 * Light mode is the primary design; dark mode keeps the same accents.
 */
const tintLight = '#0F766E'; // teal-700
const tintDark = '#5EEAD4'; // teal-300

export default {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    background: '#F0FDFA',
    surface: '#FFFFFF',
    border: '#CCFBF1',
    tint: tintLight,
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintLight,
    success: '#047857',
    successBg: '#D1FAE5',
    error: '#B91C1C',
    errorBg: '#FEE2E2',
    accent: '#0EA5E9',
    accentSoft: '#E0F2FE',
    chip: '#E6FFFA',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0B1220',
    surface: '#111827',
    border: '#1E293B',
    tint: tintDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintDark,
    success: '#34D399',
    successBg: '#064E3B',
    error: '#F87171',
    errorBg: '#7F1D1D',
    accent: '#38BDF8',
    accentSoft: '#0C4A6E',
    chip: '#134E4A',
  },
};
