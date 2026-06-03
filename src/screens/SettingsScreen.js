import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import AnimatedToggle from '../components/AnimatedToggle';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';

import useTheme from '../hooks/useTheme';
import { toggleSetting } from '../redux/settingsSlice';
import { signOut } from '../redux/authSlice';
import { gradients } from '../constants/theme';
import { enterCard, enterUp } from '../animations/transitions';
import { selectStats } from '../redux/selectors';
import { haptic } from '../utils/haptics';

const Row = ({ icon, label, sub, onPress, right, color, last }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptic.selection();
        onPress?.();
      }}
      style={[
        styles.row,
        { borderColor: colors.divider },
        last && { borderBottomWidth: 0 },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: (color || '#7C5CFF') + '22' },
        ]}
      >
        <Icon name={icon} size={16} color={color || colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
        {sub ? (
          <Text style={[styles.rowSub, { color: colors.textMuted }]}>{sub}</Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
};

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const settings = useSelector((s) => s.settings);
  const user = useSelector((s) => s.auth.user);
  const stats = useSelector(selectStats);

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => dispatch(signOut()) },
    ]);
  };

  return (
    <Background>
      <View style={[styles.root, { paddingTop: 0 }]}>
        <ScreenHeader title="Settings" subtitle="Make TaskChain yours" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 140,
          }}
        >
          <Animated.View entering={enterCard(40)}>
            <GlassCard padding={20} gradient={gradients.glass} glow>
              <View style={styles.profileRow}>
                <View style={styles.profileAvatar}>
                  <LinearGradient
                    colors={gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                  <Text style={styles.profileInitial}>
                    {(user?.name || 'TC').slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                    {user?.name || 'Guest'}
                  </Text>
                  <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
                    {user?.email || 'guest@taskchain.app'}
                  </Text>
                </View>
                <View style={[styles.streakChip, { backgroundColor: colors.primary + '22' }]}>
                  <Icon name="zap" size={12} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 12, marginLeft: 4 }}>
                    {stats.completed}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.Text entering={enterUp(120)} style={[styles.section, { color: colors.textMuted }]}>
            Appearance
          </Animated.Text>
          <Animated.View entering={enterCard(140)}>
            <GlassCard padding={4}>
              <Row
                icon="moon"
                label="Dark mode"
                sub="Soft, low-glare luxury palette"
                color="#7C5CFF"
                right={
                  <AnimatedToggle
                    value={settings.darkMode}
                    onChange={() => dispatch(toggleSetting('darkMode'))}
                  />
                }
                last
              />
            </GlassCard>
          </Animated.View>

          <Animated.Text entering={enterUp(180)} style={[styles.section, { color: colors.textMuted }]}>
            Preferences
          </Animated.Text>
          <Animated.View entering={enterCard(200)}>
            <GlassCard padding={4}>
              <Row
                icon="bell"
                label="Notifications"
                sub="Reminders and daily nudges"
                color="#FF6BCB"
                right={
                  <AnimatedToggle
                    value={settings.notifications}
                    onChange={() => dispatch(toggleSetting('notifications'))}
                  />
                }
              />
              <Row
                icon="zap"
                label="Haptics"
                sub="Premium tactile feedback"
                color="#5CCFFF"
                right={
                  <AnimatedToggle
                    value={settings.haptics}
                    onChange={() => dispatch(toggleSetting('haptics'))}
                  />
                }
              />
              <Row
                icon="check-square"
                label="Show completed"
                sub="Keep finished tasks visible"
                color="#3DDC97"
                right={
                  <AnimatedToggle
                    value={settings.showCompleted}
                    onChange={() => dispatch(toggleSetting('showCompleted'))}
                  />
                }
                last
              />
            </GlassCard>
          </Animated.View>

          <Animated.Text entering={enterUp(260)} style={[styles.section, { color: colors.textMuted }]}>
            About
          </Animated.Text>
          <Animated.View entering={enterCard(280)}>
            <GlassCard padding={4}>
              <Row
                icon="info"
                label="Version"
                sub="TaskChain 1.0.0 · Build 100"
                color="#9C7BFF"
                onPress={() => {}}
              />
              <Row
                icon="shield"
                label="Privacy"
                sub="Local-first storage"
                color="#3DDC97"
                onPress={() => {}}
              />
              <Row
                icon="github"
                label="Source on GitHub"
                color="#A1A1B5"
                onPress={() => {}}
                last
              />
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterCard(340)} style={{ marginTop: 18 }}>
            <Pressable
              onPress={handleSignOut}
              style={[
                styles.signOut,
                { backgroundColor: colors.danger + '15', borderColor: colors.danger + '40' },
              ]}
            >
              <Icon name="log-out" size={16} color={colors.danger} />
              <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 14, marginLeft: 8 }}>
                Sign out
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  section: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});

export default SettingsScreen;
