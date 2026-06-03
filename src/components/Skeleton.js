import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';

const Skeleton = ({ width = '100%', height = 16, radius = 8, style }) => {
  const { colors } = useTheme();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [t]);
  const aStyle = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.5, 1], [0.4, 0.9, 0.4]),
  }));
  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.bgSurface,
        },
        aStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({ bar: { overflow: 'hidden' } });

export default Skeleton;
