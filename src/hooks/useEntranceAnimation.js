import { useEffect } from 'react';
import { useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { animation } from '../constants/theme';

/**
 * Drives a staggered entrance: opacity 0→1, translateY 24→0.
 * Returns shared values to spread into a useAnimatedStyle.
 */
const useEntranceAnimation = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, animation.springSoft));
    translateY.value = withDelay(delay, withSpring(0, animation.springSoft));
  }, [delay, opacity, translateY]);

  return { opacity, translateY };
};

export default useEntranceAnimation;
