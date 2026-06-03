import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import useTheme from '../hooks/useTheme';
import { radii, animation } from '../constants/theme';

const BottomSheet = ({ visible, onClose, children, height = 480 }) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(height);
  const overlay = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      overlay.value = withTiming(1, animation.timingMed);
      translateY.value = withSpring(0, animation.springSoft);
    } else {
      overlay.value = withTiming(0, animation.timingFast);
      translateY.value = withTiming(height, animation.timingMed);
    }
  }, [visible, height, translateY, overlay]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));

  const close = () => onClose?.();

  const drag = Gesture.Pan()
    .onChange((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 800) {
        translateY.value = withTiming(height, animation.timingMed, () => {
          runOnJS(close)();
        });
      } else {
        translateY.value = withSpring(0, animation.springSoft);
      }
    });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.bgOverlay }]} onPress={close} />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kavoid}
          pointerEvents="box-none"
        >
          <GestureDetector gesture={drag}>
            <Animated.View
              style={[
                styles.sheet,
                {
                  height,
                  backgroundColor: colors.bgElevated,
                  borderColor: colors.border,
                },
                sheetStyle,
              ]}
            >
              <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
              {children}
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  kavoid: { justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
});

export default BottomSheet;
