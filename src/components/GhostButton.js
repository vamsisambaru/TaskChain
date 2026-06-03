import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import { radii, animation } from '../constants/theme';
import { haptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GhostButton = ({ label, onPress, icon, style, height = 48 }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      onPress={() => {
        haptic.light();
        onPress?.();
      }}
      onPressIn={() => (scale.value = withSpring(0.97, animation.springSnap))}
      onPressOut={() => (scale.value = withSpring(1, animation.springSnap))}
      style={[
        animStyle,
        styles.wrap,
        { height, borderColor: colors.borderStrong, backgroundColor: colors.bgSurface },
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, { color: colors.textPrimary, marginLeft: icon ? 8 : 0 }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default GhostButton;
