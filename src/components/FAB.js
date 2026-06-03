import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from './Icon';
import { gradients, shadows, animation } from '../constants/theme';
import { haptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FAB = ({ onPress, icon = 'plus' }) => {
  const scale = useSharedValue(1);
  const halo = useSharedValue(0);

  React.useEffect(() => {
    halo.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [halo]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.4 - halo.value * 0.3,
    transform: [{ scale: 1 + halo.value * 0.25 }],
  }));
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Animated.View style={[styles.halo, haloStyle]}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.haloGrad}
        />
      </Animated.View>
      <AnimatedPressable
        onPress={() => {
          haptic.medium();
          onPress?.();
        }}
        onPressIn={() => (scale.value = withSpring(0.92, animation.springSnap))}
        onPressOut={() => (scale.value = withSpring(1, animation.springSnap))}
        style={[styles.btn, shadows.glow, btnStyle]}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Icon name={icon} size={24} color="#fff" />
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 22,
    bottom: 100,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 999,
    overflow: 'hidden',
  },
  haloGrad: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default FAB;
