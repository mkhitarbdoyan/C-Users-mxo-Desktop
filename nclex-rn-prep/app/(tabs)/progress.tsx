import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconBadge } from '@/components/IconBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/context/ProgressContext';
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';
import type { SessionSummary } from '@/types';

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ProgressScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, stats, resetProgress } = useProgress();

  if (!ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  const empty = stats.questionsAnswered === 0;
  const accuracy = stats.accuracyPercent ?? 0;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.navy }]}>Your progress</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Local readiness snapshot — accuracy and recent practice sessions on this device.
      </Text>

      {empty ? (
        <SurfaceCard>
          <Text style={[styles.emptyTitle, { color: colors.navy }]}>No practice data yet</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            Complete a few questions in Practice. Answers and session history will show up here.
          </Text>
        </SurfaceCard>
      ) : (
        <>
          <SurfaceCard>
            <View style={styles.readinessHeader}>
              <IconBadge tone="teal" size={40}>
                <Text style={[styles.glyph, { color: colors.tint }]}>%</Text>
              </IconBadge>
              <View style={{ flex: 1 }}>
                <Text style={[styles.readinessLabel, { color: colors.textMuted }]}>
                  Accuracy
                </Text>
                <Text style={[styles.readinessValue, { color: colors.navy }]}>{accuracy}%</Text>
              </View>
            </View>
            <View style={[styles.gaugeTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.gaugeFill,
                  {
                    width: `${Math.min(100, accuracy)}%`,
                    backgroundColor: accuracy >= 70 ? colors.success : colors.tintAlt,
                  },
                ]}
              />
            </View>
            <Text style={[styles.gaugeCaption, { color: colors.textMuted }]}>
              {stats.correctCount} correct of {stats.questionsAnswered} answered
            </Text>
          </SurfaceCard>

          <View style={styles.statsRow}>
            <StatCard label="Answered" value={String(stats.questionsAnswered)} tone="cyan" colors={colors} />
            <StatCard label="Correct" value={String(stats.correctCount)} tone="success" colors={colors} />
            <StatCard label="Sessions" value={String(stats.recentSessions.length)} tone="purple" colors={colors} />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.navy }]}>Recent sessions</Text>
          {stats.recentSessions.length === 0 ? (
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
              Finish a practice run (reach the last question and tap Finish) to log a session.
              Individual answers are already counted above.
            </Text>
          ) : (
            <View style={styles.sessionList}>
              {stats.recentSessions.map((session) => (
                <SessionRow key={session.id} session={session} colors={colors} />
              ))}
            </View>
          )}
        </>
      )}

      {!empty ? (
        <PrimaryButton label="Reset local progress" variant="ghost" onPress={resetProgress} />
      ) : null}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  tone,
  colors,
}: {
  label: string;
  value: string;
  tone: 'cyan' | 'success' | 'purple';
  colors: (typeof Colors)['light'];
}) {
  const glyphColor =
    tone === 'success' ? colors.success : tone === 'purple' ? colors.purple : colors.tintAlt;

  return (
    <SurfaceCard style={styles.statCard} padded={false}>
      <View style={styles.statInner}>
        <IconBadge tone={tone === 'success' ? 'success' : tone === 'purple' ? 'purple' : 'cyan'} size={32}>
          <Text style={[styles.glyphSmall, { color: glyphColor }]}>•</Text>
        </IconBadge>
        <Text style={[styles.statValue, { color: colors.navy }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
      </View>
    </SurfaceCard>
  );
}

function SessionRow({
  session,
  colors,
}: {
  session: SessionSummary;
  colors: (typeof Colors)['light'];
}) {
  const accuracy =
    session.attemptCount === 0
      ? 0
      : Math.round((session.correctCount / session.attemptCount) * 100);

  return (
    <SurfaceCard padded={false}>
      <View style={styles.sessionRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.sessionWhen, { color: colors.navy }]}>
            {formatWhen(session.endedAt)}
          </Text>
          <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>
            {session.correctCount}/{session.attemptCount} correct · {accuracy}%
          </Text>
        </View>
        <View style={[styles.miniBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.miniBarFill,
              {
                width: `${accuracy}%`,
                backgroundColor: accuracy >= 70 ? colors.success : colors.tint,
              },
            ]}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    marginTop: -spacing.sm,
  },
  emptyTitle: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    ...typography.body,
  },
  readinessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  readinessLabel: {
    ...typography.caption,
  },
  readinessValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  glyph: {
    fontWeight: '800',
    fontSize: 16,
  },
  glyphSmall: {
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 18,
  },
  gaugeTrack: {
    height: 8,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  gaugeCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statInner: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
  },
  sectionTitle: {
    ...typography.heading,
  },
  sessionList: {
    gap: spacing.sm,
  },
  sessionRow: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sessionWhen: {
    fontWeight: '700',
    fontSize: 15,
  },
  sessionMeta: {
    ...typography.caption,
  },
  miniBar: {
    height: 6,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
