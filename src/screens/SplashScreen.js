import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import { animation, gradients } from '../constants/theme';
import Background from '../components/Background';
import Logo from '../components/Logo';

const AnimatedLogo = () => {
  const scale = useSharedValue(0.5);
  const rot = useSharedValue(-12);
  const op = useSharedValue(0);
  useEffect(() => {
    op.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withSpring(1.1, animation.springSnap),
      withSpring(1, animation.spring),
    );
    rot.value = withSpring(0, animation.spring);
  }, [op, scale, rot]);
  const aStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));
  return (
    <Animated.View style={[styles.logo, aStyle]}>
      <Logo size={120} variant="rounded" />
    </Animated.View>
  );
};

const SplashScreen = () => {
  const { colors } = useTheme();
  const titleOp = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subOp = useSharedValue(0);

  useEffect(() => {
    titleOp.value = withDelay(420, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(420, withSpring(0, animation.springSoft));
    subOp.value = withDelay(720, withTiming(1, { duration: 500 }));
  }, [titleOp, titleY, subOp]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOp.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOp.value }));

  return (
    <Background>
      <View style={styles.root}>
        <AnimatedLogo />
        <Animated.Text style={[styles.title, { color: colors.textPrimary }, titleStyle]}>
          TaskChain
        </Animated.Text>
        <Animated.Text style={[styles.sub, { color: colors.textMuted }, subStyle]}>
          Forge your day, link by link.
        </Animated.Text>
      </View>
      <View pointerEvents="none" style={styles.glowWrap}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glow}
        />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    letterSpacing: 0.2,
  },
  glowWrap: {
    position: 'absolute',
    width: 300,
    height: 300,
    bottom: -120,
    alignSelf: 'center',
    opacity: 0.5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default SplashScreen;
