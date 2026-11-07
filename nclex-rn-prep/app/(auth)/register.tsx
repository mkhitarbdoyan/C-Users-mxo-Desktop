import { Link, Redirect } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import Colors from '@/constants/Colors';
import { radii, spacing, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, session, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (ready && session) {
    return <Redirect href="/(tabs)" />;
  }

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      await register({ name, email, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.wash, { backgroundColor: colors.backgroundWash }]}>
          <View style={[styles.swoosh, { backgroundColor: colors.tintAlt, opacity: 0.14 }]} />
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={[styles.brand, { color: colors.tint }]}>NCLEX RN Prep</Text>
          <Text style={[styles.title, { color: colors.navy }]}>Create your account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Local registration only — a study profile is created automatically.
          </Text>

          <Field label="Name" value={name} onChangeText={setName} colors={colors} autoComplete="name" />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            colors={colors}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Field
            label="Password (min 6)"
            value={password}
            onChangeText={setPassword}
            colors={colors}
            secureTextEntry
            autoComplete="new-password"
          />

          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

          <PrimaryButton
            label={busy ? 'Creating…' : 'Create account'}
            disabled={busy || !name.trim() || !email.trim() || password.length < 6}
            onPress={onSubmit}
          />

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={{ color: colors.tint, fontWeight: '700' }}>
              Sign in
            </Link>
          </Text>

          {busy ? <ActivityIndicator color={colors.tint} style={{ marginTop: spacing.sm }} /> : null}
        </SurfaceCard>
      </ScrollView>
    </KeyboardAvoidingView>
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  wash: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  swoosh: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: -70,
    right: -50,
  },
  card: {
    gap: spacing.md,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.display,
    fontSize: 28,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
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
  error: {
    ...typography.caption,
    fontWeight: '700',
  },
  footer: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
