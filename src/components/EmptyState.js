import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';
import { gradients, radii } from '../constants/theme';
import { enterCard } from '../animations/transitions';
import Icon from './Icon';

const EmptyState = ({ icon = 'inbox', title, subtitle }) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={enterCard(120)} style={styles.wrap}>
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={gradients.glass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radii.xl }]}
        />
        <Icon name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>{subtitle}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 56,
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
