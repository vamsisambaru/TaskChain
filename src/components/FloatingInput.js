import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import useTheme from '../hooks/useTheme';
import { radii, animation } from '../constants/theme';
import Icon from './Icon';

const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  icon,
  style,
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const focus = useSharedValue(0);
  const labelLift = useSharedValue(value ? 1 : 0);

  const onFocus = () => {
    setFocused(true);
    focus.value = withTiming(1, animation.timingFast);
    labelLift.value = withSpring(1, animation.springSnap);
  };
  const onBlur = () => {
    setFocused(false);
    focus.value = withTiming(0, animation.timingFast);
    if (!value) labelLift.value = withSpring(0, animation.springSnap);
  };

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [colors.borderStrong, colors.primary],
    ),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -16 * labelLift.value },
      { scale: 1 - 0.18 * labelLift.value },
    ],
    color: interpolateColor(
      focus.value,
      [0, 1],
      [colors.textMuted, colors.primary],
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.wrap,
        { backgroundColor: colors.bgSurface },
        containerStyle,
        style,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          size={18}
          color={focused ? colors.primary : colors.textMuted}
          style={{ marginRight: 10 }}
        />
      ) : null}
      <View style={styles.fieldWrap}>
        <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor={colors.primary}
        />
      </View>
      {secureTextEntry ? (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
          <Icon name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderWidth: 1,
  },
  fieldWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
    margin: 0,
    height: 22,
  },
});

export default FloatingInput;
