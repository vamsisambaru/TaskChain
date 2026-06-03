import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import Background from '../components/Background';
import FloatingInput from '../components/FloatingInput';
import GradientButton from '../components/GradientButton';
import GhostButton from '../components/GhostButton';
import Icon from '../components/Icon';
import { AppleIcon, GoogleIcon } from '../components/BrandIcon';
import Logo from '../components/Logo';
import useTheme from '../hooks/useTheme';
import { signIn } from '../redux/authSlice';
import { enterCard, enterUp } from '../animations/transitions';
import { haptic } from '../utils/haptics';

const AuthScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    if (!email.includes('@') || password.length < 4) {
      setError('Please enter a valid email and a password of at least 4 characters.');
      haptic.warning();
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your name.');
      haptic.warning();
      return;
    }
    haptic.success();
    dispatch(
      signIn({
        id: 'u-' + Math.random().toString(36).slice(2, 8),
        name: mode === 'register' ? name.trim() : email.split('@')[0],
        email: email.trim(),
      }),
    );
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={enterUp(0)}>
            <View style={styles.brandRow}>
              <Logo size={32} variant="rounded" style={{ marginRight: 10 }} />
              <Text style={[styles.brandText, { color: colors.textPrimary }]}>TaskChain</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {mode === 'login' ? 'Welcome back' : 'Create your space'}
            </Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              {mode === 'login'
                ? 'Sign in to pick up exactly where you left off.'
                : 'A focused workspace for everything on your mind.'}
            </Text>
          </Animated.View>

          <View style={styles.form}>
            {mode === 'register' ? (
              <Animated.View entering={enterCard(80)} style={{ marginBottom: 14 }}>
                <FloatingInput
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  icon="user"
                  autoCapitalize="words"
                />
              </Animated.View>
            ) : null}
            <Animated.View entering={enterCard(120)} style={{ marginBottom: 14 }}>
              <FloatingInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                icon="mail"
                keyboardType="email-address"
              />
            </Animated.View>
            <Animated.View entering={enterCard(180)} style={{ marginBottom: 8 }}>
              <FloatingInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                icon="lock"
                secureTextEntry
              />
            </Animated.View>
            {error ? (
              <Animated.Text
                entering={enterCard(0)}
                style={[styles.error, { color: colors.danger }]}
              >
                {error}
              </Animated.Text>
            ) : null}

            <Animated.View entering={enterCard(240)} style={{ marginTop: 14 }}>
              <GradientButton
                label={mode === 'login' ? 'Sign In' : 'Create Account'}
                onPress={submit}
                icon={<Icon name="arrow-right" size={18} color="#fff" />}
              />
            </Animated.View>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.or, { color: colors.textMuted }]}>or continue with</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.socials}>
              <GhostButton
                style={styles.flex}
                label="Apple"
                icon={<AppleIcon size={18} color={colors.textPrimary} />}
                onPress={() =>
                  dispatch(signIn({ id: 'guest-apple', name: 'Guest', email: 'guest@taskchain.app' }))
                }
              />
              <View style={{ width: 10 }} />
              <GhostButton
                style={styles.flex}
                label="Google"
                icon={<GoogleIcon size={18} />}
                onPress={() =>
                  dispatch(signIn({ id: 'guest-google', name: 'Guest', email: 'guest@taskchain.app' }))
                }
              />
            </View>

            <Pressable
              hitSlop={10}
              onPress={() => {
                haptic.selection();
                setMode((m) => (m === 'login' ? 'register' : 'login'));
                setError('');
              }}
              style={styles.toggle}
            >
              <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  {mode === 'login' ? 'Create one' : 'Sign in'}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 28,
  },
  form: {},
  error: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  or: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  socials: {
    flexDirection: 'row',
  },
  flex: { flex: 1 },
  toggle: {
    alignItems: 'center',
    marginTop: 22,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthScreen;
