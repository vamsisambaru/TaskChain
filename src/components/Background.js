import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme';

/**
 * App-wide background — base color + subtle radial-ish gradient orbs
 * faked with translucent absolute-positioned circles. Looks identical
 * to the Linear/Arc dark luxury aesthetic.
 */
const Background = ({ children }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.orb, styles.orbA]}>
        <LinearGradient
          colors={['rgba(124,92,255,0.55)', 'rgba(124,92,255,0)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[styles.orb, styles.orbB]}>
        <LinearGradient
          colors={['rgba(255,107,203,0.45)', 'rgba(255,107,203,0)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[styles.orb, styles.orbC]}>
        <LinearGradient
          colors={['rgba(92,207,255,0.35)', 'rgba(92,207,255,0)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  orbA: {
    width: 320,
    height: 320,
    top: -120,
    left: -80,
    opacity: 0.85,
  },
  orbB: {
    width: 260,
    height: 260,
    top: 220,
    right: -80,
    opacity: 0.8,
  },
  orbC: {
    width: 380,
    height: 380,
    bottom: -160,
    left: -60,
    opacity: 0.6,
  },
});

export default Background;
