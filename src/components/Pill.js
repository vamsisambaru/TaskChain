import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import { animation, radii } from '../constants/theme';
import { haptic } from '../utils/haptics';
import Icon from './Icon';

const Pill = ({ label, active, onPress, color, icon }) => {
  const { colors } = useTheme();
  const t = useSharedValue(active ? 1 : 0);
  React.useEffect(() => {
    t.value = withSpring(active ? 1 : 0, animation.springSnap);
  }, [active, t]);
  const aStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      t.value,
      [0, 1],
      [colors.bgSurface, color || colors.primary],
    ),
  }));
  return (
    <Pressable
      onPress={() => {
        haptic.selection();
        onPress?.();
      }}
    >
      <Animated.View style={[styles.pill, { borderColor: colors.border }, aStyle]}>
        {icon ? (
          <Icon
            name={icon}
            size={12}
            color={active ? '#fff' : colors.textSecondary}
            style={{ marginRight: 6 }}
          />
        ) : null}
        <Text
          style={[
            styles.text,
            { color: active ? '#fff' : colors.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default Pill;
