import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';

import useTheme from '../hooks/useTheme';
import {
  selectStats,
  selectWeeklyCompletion,
  selectPriorityDistribution,
  selectCategoryDistribution,
} from '../redux/selectors';
import { CATEGORIES, PRIORITIES, getCategory } from '../constants/categories';
import { gradients } from '../constants/theme';
import { enterCard, enterUp } from '../animations/transitions';

const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const stats = useSelector(selectStats);
  const weekly = useSelector(selectWeeklyCompletion);
  const priorityDist = useSelector(selectPriorityDistribution);
  const categoryDist = useSelector(selectCategoryDistribution);

  const prioritySlices = PRIORITIES.map((p) => ({
    key: p.id,
    color: p.color,
    value: priorityDist[p.id] || 0,
  }));
  const categorySlices = CATEGORIES.map((c) => ({
    key: c.id,
    color: c.color,
    value: categoryDist[c.id] || 0,
  }));

  const totalThisWeek = weekly.reduce((s, d) => s + d.count, 0);
  const bestDay = weekly.reduce(
    (best, d) => (d.count > best.count ? d : best),
    weekly[0] || { label: '—', count: 0 },
  );

  return (
    <Background>
      <View style={[styles.root, { paddingTop: 0 }]}>
        <ScreenHeader title="Insights" subtitle="Your productivity, clearly" />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={enterCard(40)}>
            <GlassCard padding={22} gradient={gradients.glass} glow>
              <Text style={[styles.label, { color: colors.textMuted }]}>
                Productivity
              </Text>
              <View style={styles.heroRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.heroValue, { color: colors.textPrimary }]}>
                    {stats.productivity}%
                  </Text>
                  <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                    of all tasks completed
                  </Text>
                  <View style={styles.miniRow}>
                    <View style={styles.miniCol}>
                      <Text style={[styles.miniValue, { color: colors.textPrimary }]}>
                        {totalThisWeek}
                      </Text>
                      <Text style={[styles.miniLabel, { color: colors.textMuted }]}>
                        This week
                      </Text>
                    </View>
                    <View style={styles.miniCol}>
                      <Text style={[styles.miniValue, { color: colors.textPrimary }]}>
                        {bestDay.label}
                      </Text>
                      <Text style={[styles.miniLabel, { color: colors.textMuted }]}>
                        Best day
                      </Text>
                    </View>
                  </View>
                </View>
                <ProgressRing
                  progress={stats.productivity / 100}
                  size={120}
                  strokeWidth={12}
                >
                  <Icon name="zap" size={20} color={colors.primary} />
                  <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 4 }}>
                    {stats.productivity}%
                  </Text>
                </ProgressRing>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterUp(120)} style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Weekly performance
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              Last 7 days · merge-sorted timeline
            </Text>
          </Animated.View>

          <Animated.View entering={enterCard(160)}>
            <GlassCard padding={20}>
              <BarChart data={weekly} gradient={['#7C5CFF', '#5CCFFF']} />
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterUp(220)} style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Priority distribution
            </Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              Heap-weighted view
            </Text>
          </Animated.View>

          <Animated.View entering={enterCard(260)}>
            <GlassCard padding={20}>
              <View style={styles.donutRow}>
                <DonutChart
                  size={150}
                  strokeWidth={20}
                  slices={prioritySlices}
                  centerValue={stats.total}
                  centerLabel="TASKS"
                />
                <View style={{ flex: 1, marginLeft: 18 }}>
                  {PRIORITIES.map((p) => (
                    <View style={styles.legendRow} key={p.id}>
                      <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                      <Text style={[styles.legendLabel, { color: colors.textPrimary }]}>
                        {p.label}
                      </Text>
                      <Text style={[styles.legendValue, { color: colors.textMuted }]}>
                        {priorityDist[p.id] || 0}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterUp(320)} style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Category mix
            </Text>
          </Animated.View>

          <Animated.View entering={enterCard(360)}>
            <GlassCard padding={20}>
              <View style={styles.donutRow}>
                <DonutChart
                  size={150}
                  strokeWidth={20}
                  slices={categorySlices}
                  centerValue={Object.values(categoryDist).reduce((a, b) => a + b, 0)}
                  centerLabel="ITEMS"
                />
                <View style={{ flex: 1, marginLeft: 18 }}>
                  {CATEGORIES.map((c) => {
                    const v = categoryDist[c.id] || 0;
                    if (v === 0) return null;
                    const cat = getCategory(c.id);
                    return (
                      <View style={styles.legendRow} key={c.id}>
                        <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                        <Text style={[styles.legendLabel, { color: colors.textPrimary }]}>
                          {cat.label}
                        </Text>
                        <Text style={[styles.legendValue, { color: colors.textMuted }]}>{v}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  heroValue: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 6,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  miniRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  miniCol: {
    marginRight: 24,
  },
  miniValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  sectionHead: {
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AnalyticsScreen;
