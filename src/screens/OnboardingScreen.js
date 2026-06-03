import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Background from '../components/Background';
import GradientButton from '../components/GradientButton';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import useTheme from '../hooks/useTheme';
import { ONBOARDING_SLIDES } from '../constants/onboarding';
import { completeOnboarding } from '../redux/authSlice';
import { haptic } from '../utils/haptics';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const Dot = ({ index, scrollX, color }) => {
  const dotStyle = useAnimatedStyle(() => {
    const ip = [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH];
    return {
      width: interpolate(scrollX.value, ip, [8, 28, 8], Extrapolate.CLAMP),
      opacity: interpolate(scrollX.value, ip, [0.4, 1, 0.4], Extrapolate.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, { backgroundColor: color }, dotStyle]} />;
};

const Slide = ({ item, index, scrollX }) => {
  const { colors } = useTheme();
  const inputRange = [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH];
  const illoStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(scrollX.value, inputRange, [WIDTH * 0.3, 0, -WIDTH * 0.3], Extrapolate.CLAMP),
      },
      {
        scale: interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP),
      },
    ],
    opacity: interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP),
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolate.CLAMP),
      },
    ],
  }));
  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.illo, illoStyle]}>
        <LinearGradient
          colors={[item.accent, '#5CCFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 60 }]}
        />
        <View style={styles.illoInner}>
          <Icon name={item.icon} size={68} color="#fff" />
        </View>
      </Animated.View>
      <Animated.View style={[styles.copy, textStyle]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          {item.subtitle}
        </Text>
      </Animated.View>
    </View>
  );
};

const OnboardingScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const scrollX = useSharedValue(0);
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  const handler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const goNext = () => {
    haptic.medium();
    if (index < ONBOARDING_SLIDES.length - 1) {
      const next = index + 1;
      ref.current?.scrollToOffset({ offset: next * WIDTH, animated: true });
      setIndex(next);
    } else {
      dispatch(completeOnboarding());
    }
  };
  const skip = () => {
    haptic.light();
    dispatch(completeOnboarding());
  };

  return (
    <Background>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <Logo size={28} variant="rounded" style={{ marginRight: 8 }} />
            <Text style={[styles.brandText, { color: colors.textPrimary }]}>TaskChain</Text>
          </View>
          <Pressable onPress={skip} hitSlop={10}>
            <Text style={[styles.skip, { color: colors.textMuted }]}>Skip</Text>
          </Pressable>
        </View>
        <Animated.FlatList
          ref={ref}
          data={ONBOARDING_SLIDES}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item, index: i }) => (
            <Slide item={item} index={i} scrollX={scrollX} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / WIDTH))
          }
        />
        <View style={styles.dots}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} color={colors.primary} />
          ))}
        </View>
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <GradientButton
            label={index === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            onPress={goNext}
            icon={<Icon name="arrow-right" size={18} color="#fff" />}
          />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  skip: {
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    width: WIDTH,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: HEIGHT * 0.04,
  },
  illo: {
    width: 220,
    height: 220,
    borderRadius: 60,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 56,
  },
  illoInner: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 12,
  },
  sub: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 24,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
  footer: {
    paddingHorizontal: 22,
  },
});

export default OnboardingScreen;
