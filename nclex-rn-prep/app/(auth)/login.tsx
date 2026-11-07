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

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, session, login, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (ready && session) {
    return <Redirect href="/(tabs)" />;
  }

  const run = async (action: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await action();
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
          <View style={[styles.swoosh, { backgroundColor: colors.tint, opacity: 0.14 }]} />
          <View style={[styles.swooshAlt, { backgroundColor: colors.tintAlt, opacity: 0.12 }]} />
        </View>

        <SurfaceCard style={styles.card}>
          <Text style={[styles.brand, { color: colors.tint }]}>NCLEX RN Prep</Text>
          <Text style={[styles.title, { color: colors.navy }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in locally to continue studying. Sessions stay on this device.
          </Text>

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            colors={colors}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            colors={colors}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
          />

          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

          <PrimaryButton
            label={busy ? 'Signing in…' : 'Sign in'}
            disabled={busy || !email.trim() || !password}
            onPress={() => run(() => login({ email, password }))}
          />
          <PrimaryButton
            label="Continue with Google"
            variant="secondary"
            disabled={busy}
            onPress={() => run(() => signInWithGoogle())}
          />

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            New here?{' '}
            <Link href="/(auth)/register" style={{ color: colors.tint, fontWeight: '700' }}>
              Create an account
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
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -80,
    right: -60,
  },
  swooshAlt: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    bottom: 40,
    left: -50,
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
