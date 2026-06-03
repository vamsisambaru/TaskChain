import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';
import { gradients, radii, shadows } from '../constants/theme';

const GlassCard = ({
  children,
  style,
  padding = 16,
  radius = radii.lg,
  glow = false,
  gradient = gradients.card,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius: radius,
          backgroundColor: colors.bgElevated,
          borderColor: colors.border,
        },
        glow ? shadows.glow : shadows.md,
        style,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View style={{ padding }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default GlassCard;
