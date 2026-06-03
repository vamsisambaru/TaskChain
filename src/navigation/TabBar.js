import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import Icon from '../components/Icon';
import { gradients, animation, radii, shadows } from '../constants/theme';
import { haptic } from '../utils/haptics';

const ICONS = {
  Home: 'home',
  Tasks: 'link-2',
  Analytics: 'trending-up',
  Settings: 'sliders',
};

const TabItem = ({ route, isFocused, onPress, label }) => {
  const { colors } = useTheme();
  const t = useSharedValue(isFocused ? 1 : 0);
  useEffect(() => {
    t.value = withSpring(isFocused ? 1 : 0, animation.springSnap);
  }, [isFocused, t]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -t.value * 4 }, { scale: 1 + t.value * 0.06 }],
  }));
  const dotStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: t.value }],
  }));
  return (
    <Pressable
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={styles.item}
    >
      <Animated.View style={iconStyle}>
        <Icon
          name={ICONS[route.name] || 'circle'}
          size={22}
          color={isFocused ? colors.primary : colors.textMuted}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: isFocused ? colors.primary : colors.textMuted },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle]} />
    </Pressable>
  );
};

const TabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View
        style={[
          styles.bar,
          shadows.md,
          { backgroundColor: colors.bgElevated, borderColor: colors.border },
        ]}
      >
        <LinearGradient
          colors={gradients.glass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radii.xl }]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  bar: {
    flexDirection: 'row',
    height: 68,
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    marginTop: 4,
  },
});

export default TabBar;
