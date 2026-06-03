import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

import useTheme from '../hooks/useTheme';
import { greeting, todayLabel, formatRelative } from '../utils/date';
import { selectStats, selectActivity, selectAllTasks } from '../redux/selectors';
import { toggleTask, deleteTask, hydrateTasks } from '../redux/tasksSlice';
import { PriorityQueue, computeScore } from '../dsa';
import { gradients } from '../constants/theme';
import { enterCard, enterUp } from '../animations/transitions';

const ActivityRow = ({ item, color, label }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.activityRow}>
      <View style={[styles.activityDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.activityTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.activitySub, { color: colors.textMuted }]}>
          {label} · {formatRelative(item.at)}
        </Text>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const stats = useSelector(selectStats);
  const activity = useSelector(selectActivity);
  const allTasks = useSelector(selectAllTasks);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(hydrateTasks());
    setRefreshing(false);
  }, [dispatch]);

  // Smart-priority top picks via min-heap (DSA)
  const smartTop = React.useMemo(
    () =>
      PriorityQueue.from(
        allTasks.filter((t) => !t.completed),
        computeScore,
      )
        .toSortedArray()
        .slice(0, 3),
    [allTasks],
  );

  const recentActivity = activity.slice(0, 5);
  const activityLabel = (t) =>
    ({
      created: 'Created',
      completed: 'Completed',
      deleted: 'Deleted',
      restored: 'Restored',
    }[t] || t);
  const activityColor = (t) =>
    ({
      created: colors.primary,
      completed: colors.success,
      deleted: colors.danger,
      restored: colors.warning,
    }[t] || colors.primary);

  return (
    <Background>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 12, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={enterUp(0)} style={styles.headerRow}>
          <View>
            <Text style={[styles.hello, { color: colors.textMuted }]}>
              {greeting()}{user ? `, ${user.name?.split(' ')[0]}` : ''}
            </Text>
            <Text style={[styles.dateText, { color: colors.textPrimary }]}>
              {todayLabel()}
            </Text>
          </View>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.bgSurface, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 16 }}>
              {(user?.name || 'TC').slice(0, 1).toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={enterCard(80)}>
          <GlassCard padding={20} gradient={gradients.glass} glow>
            <View style={styles.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroLabel, { color: colors.textMuted }]}>
                  Productivity score
                </Text>
                <Text style={[styles.heroValue, { color: colors.textPrimary }]}>
                  {stats.productivity}%
                </Text>
                <Text style={[styles.heroSub, { color: colors.textSecondary }]}>
                  {stats.completed} of {stats.total} tasks completed
                </Text>
                <Pressable
                  onPress={() => navigation.navigate('Analytics')}
                  hitSlop={6}
                  style={styles.heroLink}
                >
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
                    View insights
                  </Text>
                  <Icon name="arrow-right" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
                </Pressable>
              </View>
              <ProgressRing progress={stats.productivity / 100} size={120} strokeWidth={12}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: colors.textPrimary }}>
                  {stats.productivity}%
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textMuted }}>
                  TODAY
                </Text>
              </ProgressRing>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={styles.statsRow}>
          <StatCard
            label="Pending"
            value={stats.pending}
            icon="layers"
            accent="primary"
            delay={120}
            hint="OPEN"
          />
          <View style={{ width: 12 }} />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon="check-circle"
            accent="forest"
            delay={180}
            hint="DONE"
          />
        </View>
        <View style={[styles.statsRow, { marginTop: 12 }]}>
          <StatCard
            label="Today"
            value={stats.todayCount}
            icon="sun"
            accent="sunrise"
            delay={220}
            hint="DUE"
          />
          <View style={{ width: 12 }} />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon="alert-triangle"
            accent="pink"
            delay={260}
            hint="LATE"
          />
        </View>

        <Animated.View entering={enterUp(280)} style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Smart picks
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Min-heap priority engine
          </Text>
        </Animated.View>

        {smartTop.length === 0 ? (
          <EmptyState
            icon="sun"
            title="All caught up"
            subtitle="Nothing on your plate. Add a task to chain it in."
          />
        ) : (
          smartTop.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onPress={(task) => navigation.navigate('TaskDetails', { taskId: task.id })}
              onToggle={(id) => dispatch(toggleTask(id))}
              onDelete={(id) => dispatch(deleteTask(id))}
            />
          ))
        )}

        {recentActivity.length > 0 ? (
          <>
            <Animated.View entering={enterUp(320)} style={styles.sectionHead}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Recent activity
              </Text>
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                Bounded queue · last 5
              </Text>
            </Animated.View>
            <Animated.View entering={enterCard(360)}>
              <GlassCard padding={16}>
                {recentActivity.map((item) => (
                  <ActivityRow
                    key={item.id}
                    item={item}
                    color={activityColor(item.type)}
                    label={activityLabel(item.type)}
                  />
                ))}
              </GlassCard>
            </Animated.View>
          </>
        ) : null}
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  hello: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  heroLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activitySub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});

export default HomeScreen;
