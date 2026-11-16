import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconBadge } from '@/components/IconBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useProgress } from '@/context/ProgressContext';
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';
import { FLASHCARDS } from '@/data/flashcards';
import { QUESTIONS } from '@/data/questions';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { session } = useAuth();
  const { profile } = useProfile();
  const { stats, ready } = useProgress();

  const greetingName = profile?.name || session?.user.name;
  const accuracy =
    !ready || stats.accuracyPercent === null ? '—' : `${stats.accuracyPercent}%`;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.heroWash, { backgroundColor: colors.backgroundWash }]}>
        <View style={[styles.swoosh, { backgroundColor: colors.tint, opacity: 0.14 }]} />
        <View style={[styles.swooshAlt, { backgroundColor: colors.tintAlt, opacity: 0.12 }]} />

        <Text style={[styles.brand, { color: colors.tint }]}>NCLEX RN Prep</Text>
        <Text style={[styles.headline, { color: colors.navy }]}>
          {greetingName
            ? `Hi ${greetingName.split(' ')[0]} — ready to practice?`
            : 'Build clinical judgment with calm, focused practice.'}
        </Text>
        <Text style={[styles.support, { color: colors.textSecondary }]}>
          Questions, flashcards, and progress in one light clinical study space.
        </Text>

        <View style={styles.pathRow}>
          <PathPill label="NCLEX-RN" colors={colors} />
          <PathPill label="Learn" colors={colors} />
          <PathPill label="Practice" colors={colors} />
          <PathPill label="Flashcards" colors={colors} />
        </View>
      </View>

      <View style={styles.actions}>
        <Link href="/practice" asChild>
          <PrimaryButton label="Start practice" />
        </Link>
        <Link href="/flashcards" asChild>
          <PrimaryButton label="Review flashcards" variant="secondary" />
        </Link>
        <Link href="/exam" asChild>
          <PrimaryButton label="Exam mode" variant="secondary" />
        </Link>
        <Link href="/learn" asChild>
          <PrimaryButton label="Browse topics" variant="secondary" />
        </Link>
        <View style={styles.secondaryActions}>
          <Link href="/progress" asChild>
            <PrimaryButton label="Progress" variant="ghost" style={styles.flexBtn} />
          </Link>
          <Link href="/profile" asChild>
            <PrimaryButton label="Profile" variant="ghost" style={styles.flexBtn} />
          </Link>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetricCard
          label="Questions"
          value={String(QUESTIONS.length)}
          tone="teal"
          colors={colors}
          glyph="Q"
        />
        <MetricCard
          label="Flashcards"
          value={String(FLASHCARDS.length)}
          tone="cyan"
          colors={colors}
          glyph="F"
        />
        <MetricCard
          label="Accuracy"
          value={accuracy}
          tone="purple"
          colors={colors}
          glyph="%"
        />
      </View>
    </ScrollView>
  );
}

function PathPill({
  label,
  colors,
}: {
  label: string;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={[styles.pathPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.pathPillText, { color: colors.navy }]}>{label}</Text>
    </View>
  );
}

function MetricCard({
  label,
  value,
  tone,
  colors,
  glyph,
}: {
  label: string;
  value: string;
  tone: 'teal' | 'cyan' | 'purple';
  colors: (typeof Colors)['light'];
  glyph: string;
}) {
  const glyphColor =
    tone === 'purple' ? colors.purple : tone === 'cyan' ? colors.tintAlt : colors.tint;

  return (
    <SurfaceCard style={styles.metaItem} padded={false}>
      <View style={styles.metaInner}>
        <IconBadge tone={tone} size={36}>
          <Text style={[styles.glyph, { color: glyphColor }]}>{glyph}</Text>
        </IconBadge>
        <Text style={[styles.metaValue, { color: colors.navy }]}>{value}</Text>
        <Text style={[styles.metaLabel, { color: colors.textMuted }]}>{label}</Text>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  heroWash: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    overflow: 'hidden',
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  swoosh: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -60,
    right: -40,
    transform: [{ scaleX: 1.4 }],
  },
  swooshAlt: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    bottom: -40,
    left: -30,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  headline: {
    ...typography.display,
    maxWidth: 340,
  },
  support: {
    ...typography.body,
    maxWidth: 320,
  },
  pathRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  pathPill: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pathPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexBtn: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  metaItem: {
    flex: 1,
  },
  metaInner: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
  },
  glyph: {
    fontWeight: '800',
    fontSize: 14,
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  metaLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
});
