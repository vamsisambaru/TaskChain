import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import { animation, radii } from '../constants/theme';
import { haptic } from '../utils/haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SegmentedControl = ({ items, value, onChange }) => {
  const { colors } = useTheme();
  const [widths, setWidths] = useState({});
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  useEffect(() => {
    const idx = items.findIndex((i) => i.id === value);
    if (idx >= 0 && widths[idx] != null) {
      let x = 4;
      for (let i = 0; i < idx; i += 1) x += (widths[i] || 0);
      indicatorX.value = withSpring(x, animation.springSnap);
      indicatorW.value = withSpring(widths[idx] || 0, animation.springSnap);
    }
  }, [value, widths, items, indicatorX, indicatorW]);

  const indStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  return (
    <View style={[styles.wrap, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
      <Animated.View style={[styles.indicator, { backgroundColor: colors.primary }, indStyle]} />
      {items.map((item, i) => {
        const active = item.id === value;
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              haptic.selection();
              onChange?.(item.id);
            }}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setWidths((prev) => (prev[i] === w ? prev : { ...prev, [i]: w }));
            }}
            style={styles.item}
          >
            <Text
              style={[
                styles.label,
                { color: active ? '#fff' : colors.textSecondary },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    padding: 4,
    borderWidth: 1,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: radii.pill,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

export default SegmentedControl;
