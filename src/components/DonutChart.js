import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Slice = ({ size, radius, strokeWidth, color, fraction, offset, delay }) => {
  const c = 2 * Math.PI * radius;
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withTiming(fraction, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [fraction, v, delay]);
  const props = useAnimatedProps(() => ({
    strokeDasharray: `${v.value * c} ${c}`,
  }));
  const rotation = -90 + offset * 360;
  return (
    <AnimatedCircle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      fill="transparent"
      animatedProps={props}
      rotation={rotation}
      origin={`${size / 2}, ${size / 2}`}
    />
  );
};

const DonutChart = ({ size = 160, strokeWidth = 18, slices = [], centerLabel, centerValue }) => {
  const { colors } = useTheme();
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;

  let offset = 0;
  const built = slices.map((s) => {
    const fraction = s.value / total;
    const slice = { ...s, fraction, offset };
    offset += fraction;
    return slice;
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <G>
          {built.map((s, i) => (
            <Slice
              key={s.key || i}
              size={size}
              radius={radius}
              strokeWidth={strokeWidth}
              color={s.color}
              fraction={s.fraction}
              offset={s.offset}
              delay={i * 60}
            />
          ))}
        </G>
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{centerValue}</Text>
        {centerLabel ? (
          <Text style={[styles.label, { color: colors.textMuted }]}>{centerLabel}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  value: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 11, fontWeight: '600', marginTop: 2, letterSpacing: 0.4 },
});

export default DonutChart;
