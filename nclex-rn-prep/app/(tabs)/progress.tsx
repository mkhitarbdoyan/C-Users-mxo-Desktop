import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/context/ProgressContext';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';
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

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>Your progress</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Saved on this device with AsyncStorage. No account required.
      </Text>

      {empty ? (
        <View
          style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No practice data yet</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            Complete a few questions in Practice. Answers and session history will show up here.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard
              label="Answered"
              value={String(stats.questionsAnswered)}
              colors={colors}
            />
            <StatCard
              label="Correct"
              value={String(stats.correctCount)}
              colors={colors}
            />
            <StatCard
              label="Accuracy"
              value={`${stats.accuracyPercent ?? 0}%`}
              colors={colors}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent sessions</Text>
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
  colors,
}: {
  label: string;
  value: string;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: colors.tint }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
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
    <View style={[styles.sessionRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[styles.sessionWhen, { color: colors.text }]}>{formatWhen(session.endedAt)}</Text>
        <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>
          {session.correctCount}/{session.attemptCount} correct · {accuracy}%
        </Text>
      </View>
    </View>
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
    fontSize: 24,
  },
  subtitle: {
    ...typography.body,
    marginTop: -spacing.sm,
  },
  empty: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadow.card,
  },
  emptyTitle: {
    ...typography.heading,
  },
  emptyBody: {
    ...typography.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
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
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  sessionWhen: {
    fontWeight: '600',
    fontSize: 15,
  },
  sessionMeta: {
    ...typography.caption,
  },
});
