import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';
import { radii, animation, shadows } from '../constants/theme';
import { getCategory, getPriority } from '../constants/categories';
import { formatDue, isOverdue } from '../utils/date';
import { haptic } from '../utils/haptics';
import Icon from './Icon';

const SWIPE_DELETE = -110;
const SWIPE_COMPLETE = 110;

const TaskCard = ({ task, onPress, onToggle, onDelete }) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const checkScale = useSharedValue(task.completed ? 1 : 0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    checkScale.value = withSpring(task.completed ? 1 : 0, animation.springSnap);
  }, [task.completed, checkScale]);

  const triggerDelete = () => {
    haptic.heavy();
    onDelete?.(task.id);
  };
  const triggerToggle = () => {
    haptic.success();
    onToggle?.(task.id);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onChange((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_DELETE) {
        translateX.value = withTiming(-400, { duration: 220 }, () => {
          runOnJS(triggerDelete)();
        });
      } else if (translateX.value > SWIPE_COMPLETE) {
        runOnJS(triggerToggle)();
        translateX.value = withSpring(0, animation.springSnap);
      } else {
        translateX.value = withSpring(0, animation.springSnap);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: cardScale.value },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: interpolate(
      checkScale.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP,
    )
      ? colors.primary
      : colors.borderStrong,
  }));

  const leftBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_COMPLETE], [0, 1], Extrapolate.CLAMP),
  }));
  const rightBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [SWIPE_DELETE, 0], [1, 0], Extrapolate.CLAMP),
  }));

  const cat = getCategory(task.category);
  const pri = getPriority(task.priority);
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.swipeBg, styles.swipeRight, leftBgStyle]}>
        <View style={[styles.swipeBadge, { backgroundColor: colors.success }]}>
          <Icon name="check" size={18} color="#fff" />
          <Text style={styles.swipeText}>Complete</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.swipeBg, styles.swipeLeft, rightBgStyle]}>
        <View style={[styles.swipeBadge, { backgroundColor: colors.danger }]}>
          <Icon name="trash-2" size={18} color="#fff" />
          <Text style={styles.swipeText}>Delete</Text>
        </View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>
          <Pressable
            onPress={() => {
              haptic.light();
              onPress?.(task);
            }}
            onPressIn={() => (cardScale.value = withSpring(0.98, animation.springSnap))}
            onPressOut={() => (cardScale.value = withSpring(1, animation.springSnap))}
          >
            <View
              style={[
                styles.card,
                shadows.sm,
                {
                  backgroundColor: colors.bgElevated,
                  borderColor: colors.border,
                },
                task.completed && { opacity: 0.55 },
              ]}
            >
              <Pressable onPress={triggerToggle} hitSlop={10}>
                <Animated.View
                  style={[styles.check, ringStyle, { borderColor: colors.borderStrong }]}
                >
                  <LinearGradient
                    colors={['#7C5CFF', '#5CCFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                  <Animated.View style={[styles.checkInner, checkStyle]}>
                    <Icon name="check" size={14} color="#fff" />
                  </Animated.View>
                </Animated.View>
              </Pressable>

              <View style={styles.body}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.title,
                    { color: colors.textPrimary },
                    task.completed && styles.strike,
                  ]}
                >
                  {task.title}
                </Text>

                <View style={styles.metaRow}>
                  <View style={[styles.chip, { backgroundColor: cat.color + '22' }]}>
                    <View style={[styles.dot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.chipText, { color: cat.color }]}>
                      {cat.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.chip,
                      {
                        backgroundColor: overdue
                          ? colors.danger + '22'
                          : colors.bgSurface,
                      },
                    ]}
                  >
                    <Icon
                      name="clock"
                      size={11}
                      color={overdue ? colors.danger : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: overdue ? colors.danger : colors.textSecondary,
                        },
                      ]}
                    >
                      {formatDue(task.dueDate)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.priorityBar, { backgroundColor: pri.color }]} />
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    gap: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  priorityBar: {
    width: 3,
    height: 28,
    borderRadius: 999,
    marginLeft: 4,
  },
  swipeBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeRight: {
    justifyContent: 'flex-start',
    paddingLeft: 18,
  },
  swipeLeft: {
    justifyContent: 'flex-end',
    paddingRight: 18,
  },
  swipeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  swipeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default TaskCard;
