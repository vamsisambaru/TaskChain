import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import GlassCard from './GlassCard';
import Icon from './Icon';
import useTheme from '../hooks/useTheme';
import { enterCard } from '../animations/transitions';
import { gradients } from '../constants/theme';

const StatCard = ({ label, value, icon, accent = 'primary', delay = 0, hint }) => {
  const { colors } = useTheme();
  const grad =
    accent === 'pink'
      ? gradients.pink
      : accent === 'cyan'
      ? gradients.cyan
      : accent === 'forest'
      ? gradients.forest
      : accent === 'sunrise'
      ? gradients.sunrise
      : gradients.primary;

  return (
    <Animated.View entering={enterCard(delay)} style={styles.flex}>
      <GlassCard padding={16} gradient={grad}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Icon name={icon} size={16} color="#fff" />
          </View>
          {hint ? (
            <Text style={[styles.hint, { color: 'rgba(255,255,255,0.85)' }]}>{hint}</Text>
          ) : null}
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.6,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.92,
    color: '#fff',
  },
  hint: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});

export default StatCard;
