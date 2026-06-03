import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';
import { animation } from '../constants/theme';

const Bar = ({ value, max, label, delay, gradient }) => {
  const { colors } = useTheme();
  const h = useSharedValue(0);
  useEffect(() => {
    const target = max === 0 ? 4 : Math.max(4, (value / max) * 100);
    h.value = withDelay(delay, withSpring(target, animation.springSoft));
  }, [value, max, delay, h]);
  const aStyle = useAnimatedStyle(() => ({ height: `${h.value}%` }));
  return (
    <View style={styles.barCol}>
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, aStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.barGradient}
          />
        </Animated.View>
      </View>
      <Text style={[styles.barLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.barValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
};

const BarChart = ({ data, gradient = ['#7C5CFF', '#5CCFFF'] }) => {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <View style={styles.row}>
      {data.map((d, i) => (
        <Bar
          key={d.key || d.label + i}
          value={d.count}
          max={max}
          label={d.label}
          delay={i * 60}
          gradient={gradient}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 18,
    height: 110,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 999,
  },
  barGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default BarChart;
