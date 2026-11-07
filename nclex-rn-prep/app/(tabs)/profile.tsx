import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { SurfaceCard } from '@/components/SurfaceCard';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import Colors from '@/constants/Colors';
import { NURSING_SYSTEM_LABELS, NURSING_SYSTEMS } from '@/constants/nursingSystems';
import { radii, shadow, spacing, typography } from '@/constants/theme';
import type { NursingSystem } from '@/types';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { session, logout } = useAuth();
  const { ready, profile, saveProfile } = useProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studyGoal, setStudyGoal] = useState('');
  const [categories, setCategories] = useState<NursingSystem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (profile) {
      setName(profile.name);
      setEmail(profile.email ?? '');
      setStudyGoal(profile.studyGoal ?? '');
      setCategories(profile.preferredCategories);
      setEditing(false);
    } else {
      setName(session?.user.name ?? '');
      setEmail(session?.user.email ?? '');
      setStudyGoal('');
      setCategories([]);
      setEditing(true);
    }
  }, [ready, profile, session]);

  const isEmpty = ready && !profile;

  const providerLabel = useMemo(() => {
    if (!session) return '';
    return session.user.provider === 'google' ? 'Google (mock)' : 'Email';
  }, [session]);

  const toggleCategory = (system: NursingSystem) => {
    setCategories((prev) =>
      prev.includes(system) ? prev.filter((s) => s !== system) : [...prev, system]
    );
  };

  const onSave = async () => {
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setBusy(true);
    try {
      await saveProfile({
        name,
        email: email.trim() || null,
        studyGoal: studyGoal.trim() || null,
        preferredCategories: categories,
      });
      setSuccess('Profile saved');
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.navy }]}>
        {isEmpty ? 'Set up your profile' : 'Your profile'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Signed in via {providerLabel}. Profile data is stored locally per account.
      </Text>

      {isEmpty && !editing ? (
        <SurfaceCard style={{ gap: spacing.md }}>
          <Text style={[styles.emptyTitle, { color: colors.navy }]}>No profile yet</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            Add your name, study goal, and preferred categories to personalize practice later.
          </Text>
          <PrimaryButton label="Create profile" onPress={() => setEditing(true)} />
        </SurfaceCard>
      ) : null}

      {(editing || profile) && (
        <SurfaceCard style={{ gap: spacing.md }}>
          {editing ? (
            <>
              <Field label="Name *" value={name} onChangeText={setName} colors={colors} />
              <Field
                label="Email (optional)"
                value={email}
                onChangeText={setEmail}
                colors={colors}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Field
                label="Study goal"
                value={studyGoal}
                onChangeText={setStudyGoal}
                colors={colors}
                placeholder="e.g. Pass by June 2027"
              />
              <Text style={[styles.label, { color: colors.textMuted }]}>Preferred categories</Text>
              <View style={styles.chips}>
                {NURSING_SYSTEMS.map((system) => {
                  const selected = categories.includes(system);
                  return (
                    <Pressable
                      key={system}
                      onPress={() => toggleCategory(system)}
                      style={[
                        styles.chip,
                        shadow.soft,
                        {
                          backgroundColor: selected ? colors.tint : colors.surface,
                          borderColor: selected ? colors.tint : colors.borderStrong,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipLabel,
                          { color: selected ? '#FFFFFF' : colors.navy },
                        ]}
                      >
                        {NURSING_SYSTEM_LABELS[system]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <ReadRow label="Name" value={profile!.name} colors={colors} />
              <ReadRow label="Email" value={profile!.email ?? '—'} colors={colors} />
              <ReadRow label="Study goal" value={profile!.studyGoal ?? '—'} colors={colors} />
              <ReadRow
                label="Preferred categories"
                value={
                  profile!.preferredCategories.length
                    ? profile!.preferredCategories
                        .map((s) => NURSING_SYSTEM_LABELS[s])
                        .join(', ')
                    : '—'
                }
                colors={colors}
              />
              <Text style={[styles.updated, { color: colors.textMuted }]}>
                Updated {new Date(profile!.updatedAt).toLocaleString()}
              </Text>
            </>
          )}
        </SurfaceCard>
      )}

      {error ? <Text style={[styles.feedback, { color: colors.error }]}>{error}</Text> : null}
      {success ? <Text style={[styles.feedback, { color: colors.success }]}>{success}</Text> : null}

      <View style={styles.actions}>
        {editing ? (
          <>
            <PrimaryButton
              label={busy ? 'Saving…' : 'Save profile'}
              disabled={busy}
              onPress={onSave}
            />
            {profile ? (
              <PrimaryButton
                label="Cancel"
                variant="ghost"
                disabled={busy}
                onPress={() => {
                  setEditing(false);
                  setError(null);
                  setSuccess(null);
                  setName(profile.name);
                  setEmail(profile.email ?? '');
                  setStudyGoal(profile.studyGoal ?? '');
                  setCategories(profile.preferredCategories);
                }}
              />
            ) : null}
          </>
        ) : (
          <PrimaryButton
            label="Edit profile"
            variant="secondary"
            onPress={() => {
              setSuccess(null);
              setEditing(true);
            }}
          />
        )}
        <PrimaryButton label="Sign out" variant="ghost" onPress={logout} />
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  colors,
  ...inputProps
}: {
  label: string;
  colors: (typeof Colors)['light'];
} & ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.navy,
            borderColor: colors.borderStrong,
            backgroundColor: colors.backgroundWash,
          },
        ]}
        {...inputProps}
      />
    </View>
  );
}

function ReadRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.readRow}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.readValue, { color: colors.navy }]}>{value}</Text>
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
  },
  subtitle: {
    ...typography.body,
    marginTop: -spacing.sm,
  },
  emptyTitle: { ...typography.heading },
  emptyBody: { ...typography.body },
  field: { gap: spacing.xs },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    minHeight: 48,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  readRow: { gap: 2 },
  readValue: {
    ...typography.body,
    fontWeight: '600',
  },
  updated: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  feedback: {
    ...typography.caption,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.sm,
  },
});
