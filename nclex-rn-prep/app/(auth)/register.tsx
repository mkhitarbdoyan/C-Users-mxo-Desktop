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
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { radii, shadow, spacing, typography } from '@/constants/theme';

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
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Local registration only — no server yet. A study profile is created automatically.
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
            <Link href="/(auth)/login" style={{ color: colors.tint, fontWeight: '600' }}>
              Sign in
            </Link>
          </Text>

          {busy ? <ActivityIndicator color={colors.tint} style={{ marginTop: spacing.sm }} /> : null}
        </View>
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
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.tabIconDefault}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.background,
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
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  title: {
    ...typography.title,
    fontSize: 26,
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
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    minHeight: 48,
  },
  error: {
    ...typography.caption,
    fontWeight: '600',
  },
  footer: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
