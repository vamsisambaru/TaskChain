import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { animation } from '../constants/theme';
import { haptic } from '../utils/haptics';

const AnimatedToggle = ({ value, onChange }) => {
  const t = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    t.value = withSpring(value ? 1 : 0, animation.springSnap);
  }, [value, t]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      t.value,
      [0, 1],
      ['rgba(255,255,255,0.08)', '#7C5CFF'],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(t.value * 22, animation.timingFast) }],
  }));

  return (
    <Pressable
      onPress={() => {
        haptic.selection();
        onChange?.(!value);
      }}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
});

export default AnimatedToggle;
