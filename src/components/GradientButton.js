import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { gradients, radii, shadows, animation } from '../constants/theme';
import { haptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GradientButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon = null,
  style,
  size = 'md',
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors =
    variant === 'pink'
      ? gradients.pink
      : variant === 'cyan'
      ? gradients.cyan
      : variant === 'sunrise'
      ? gradients.sunrise
      : gradients.primary;

  const sizes = {
    sm: { height: 40, font: 14, padX: 14 },
    md: { height: 52, font: 16, padX: 20 },
    lg: { height: 60, font: 17, padX: 24 },
  };
  const sz = sizes[size];

  return (
    <AnimatedPressable
      onPress={() => {
        if (disabled || loading) return;
        haptic.medium();
        onPress?.();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.96, animation.springSnap);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, animation.springSnap);
      }}
      style={[
        animatedStyle,
        styles.wrap,
        shadows.glow,
        { height: sz.height, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radii.lg }]}
      />
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              { fontSize: sz.font, marginLeft: icon ? 8 : 0 },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default GradientButton;
