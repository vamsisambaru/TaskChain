import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
} from 'react-native-reanimated';

export const enterCard = (delay = 0) =>
  FadeInDown.delay(delay).duration(420).springify().damping(18);

export const enterSubtle = (delay = 0) =>
  FadeIn.delay(delay).duration(360);

export const enterUp = (delay = 0) =>
  FadeInUp.delay(delay).duration(420).springify().damping(20);

export const enterPop = (delay = 0) =>
  ZoomIn.delay(delay).duration(360).springify().damping(14);

export const enterFromRight = (delay = 0) =>
  SlideInRight.delay(delay).duration(360).springify();

export const exitFade = FadeOut.duration(220);
export const exitLeft = SlideOutLeft.duration(220);
