import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import GhostButton from '../components/GhostButton';
import Pill from '../components/Pill';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';

import useTheme from '../hooks/useTheme';
import { selectAllTasks } from '../redux/selectors';
import {
  toggleTask,
  deleteTask,
  updateTask,
  addSubtask,
  toggleSubtask,
} from '../redux/tasksSlice';
import { getCategory, getPriority, PRIORITIES } from '../constants/categories';
import { formatDue, isOverdue, formatRelative } from '../utils/date';
import { gradients } from '../constants/theme';
import { enterCard, enterUp } from '../animations/transitions';
import { haptic } from '../utils/haptics';
import useTaskNavigator from '../hooks/useTaskNavigator';

const Subtask = ({ st, onToggle }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onToggle} style={styles.subRow}>
      <View
        style={[
          styles.subCheck,
          { borderColor: st.done ? colors.primary : colors.borderStrong },
          st.done && { backgroundColor: colors.primary },
        ]}
      >
        {st.done ? <Icon name="check" size={12} color="#fff" /> : null}
      </View>
      <Text
        style={[
          styles.subText,
          { color: colors.textPrimary },
          st.done && { textDecorationLine: 'line-through', opacity: 0.5 },
        ]}
      >
        {st.title}
      </Text>
    </Pressable>
  );
};

const TaskDetailsScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const task = tasks.find((t) => t.id === taskId);
  const { next, prev, indexOf, total } = useTaskNavigator(taskId);
  const [newSub, setNewSub] = useState('');

  if (!task) {
    return (
      <Background>
        <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
          <ScreenHeader title="Task" onBack={() => navigation.goBack()} />
          <View style={{ padding: 24 }}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              This task no longer exists.
            </Text>
          </View>
        </View>
      </Background>
    );
  }

  const cat = getCategory(task.category);
  const pri = getPriority(task.priority);
  const overdue = !task.completed && isOverdue(task.dueDate);
  const completedSubs = task.subtasks.filter((s) => s.done).length;
  const totalSubs = task.subtasks.length;
  const subProgress = totalSubs === 0 ? 0 : completedSubs / totalSubs;

  return (
    <Background>
      <View style={[styles.root, { paddingTop: 0 }]}>
        <ScreenHeader
          title={`Task ${indexOf + 1} of ${total}`}
          subtitle={cat.label}
          onBack={() => navigation.goBack()}
          right={
            <Pressable
              onPress={() => {
                haptic.heavy();
                dispatch(deleteTask(task.id));
                navigation.goBack();
              }}
              hitSlop={10}
            >
              <Icon name="trash-2" size={18} color={colors.danger} />
            </Pressable>
          }
        />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}
        >
          <Animated.View entering={enterUp(40)}>
            <View style={styles.titleRow}>
              <View style={[styles.priDot, { backgroundColor: pri.color }]} />
              <Text
                style={[
                  styles.titleText,
                  { color: colors.textPrimary },
                  task.completed && styles.strike,
                ]}
              >
                {task.title}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.metaPill, { backgroundColor: cat.color + '22' }]}>
                <Icon name={cat.icon} size={12} color={cat.color} />
                <Text style={[styles.metaText, { color: cat.color }]}>{cat.label}</Text>
              </View>
              <View
                style={[
                  styles.metaPill,
                  { backgroundColor: overdue ? colors.danger + '22' : colors.bgSurface },
                ]}
              >
                <Icon name="clock" size={12} color={overdue ? colors.danger : colors.textSecondary} />
                <Text
                  style={[
                    styles.metaText,
                    { color: overdue ? colors.danger : colors.textSecondary },
                  ]}
                >
                  {formatDue(task.dueDate)}
                </Text>
              </View>
              <View
                style={[
                  styles.metaPill,
                  { backgroundColor: pri.color + '22' },
                ]}
              >
                <Text style={[styles.metaText, { color: pri.color }]}>
                  {pri.label} priority
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={enterCard(120)} style={{ marginTop: 18 }}>
            <GlassCard padding={18} gradient={gradients.glass}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Status</Text>
              <View style={styles.statusRow}>
                <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                  {task.completed ? 'Completed' : 'In progress'}
                </Text>
                <Pressable
                  onPress={() => dispatch(toggleTask(task.id))}
                  style={[
                    styles.statusBtn,
                    { backgroundColor: task.completed ? colors.bgSurface : colors.primary },
                  ]}
                >
                  <Icon
                    name={task.completed ? 'rotate-ccw' : 'check'}
                    size={14}
                    color={task.completed ? colors.textPrimary : '#fff'}
                  />
                  <Text
                    style={[
                      styles.statusBtnText,
                      { color: task.completed ? colors.textPrimary : '#fff' },
                    ]}
                  >
                    {task.completed ? 'Reopen' : 'Mark done'}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${task.completed ? 100 : subProgress * 100}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barCaption, { color: colors.textMuted }]}>
                {totalSubs === 0
                  ? task.completed
                    ? 'Done'
                    : 'No subtasks yet'
                  : `${completedSubs} of ${totalSubs} subtasks complete`}
              </Text>
            </GlassCard>
          </Animated.View>

          {task.notes ? (
            <Animated.View entering={enterCard(180)} style={{ marginTop: 14 }}>
              <GlassCard padding={18}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Notes</Text>
                <Text style={[styles.notes, { color: colors.textPrimary }]}>
                  {task.notes}
                </Text>
              </GlassCard>
            </Animated.View>
          ) : null}

          <Animated.View entering={enterCard(220)} style={{ marginTop: 14 }}>
            <GlassCard padding={18}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                Priority
              </Text>
              <View style={styles.row}>
                {PRIORITIES.map((p) => (
                  <Pill
                    key={p.id}
                    label={p.label}
                    color={p.color}
                    active={task.priority === p.id}
                    onPress={() =>
                      dispatch(updateTask({ id: task.id, patch: { priority: p.id } }))
                    }
                  />
                ))}
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterCard(280)} style={{ marginTop: 14 }}>
            <GlassCard padding={18}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                Subtasks
              </Text>
              {task.subtasks.length === 0 ? (
                <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                  Break this down — small steps compound.
                </Text>
              ) : (
                task.subtasks.map((st) => (
                  <Subtask
                    key={st.id}
                    st={st}
                    onToggle={() =>
                      dispatch(toggleSubtask({ taskId: task.id, subtaskId: st.id }))
                    }
                  />
                ))
              )}
              <View style={styles.addSubRow}>
                <TextInput
                  value={newSub}
                  onChangeText={setNewSub}
                  placeholder="Add subtask"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.subInput,
                    { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.bgSurface },
                  ]}
                  selectionColor={colors.primary}
                />
                <Pressable
                  onPress={() => {
                    if (!newSub.trim()) return;
                    dispatch(
                      addSubtask({
                        taskId: task.id,
                        subtask: {
                          id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          title: newSub.trim(),
                          done: false,
                        },
                      }),
                    );
                    setNewSub('');
                    haptic.light();
                  }}
                  style={[styles.addSubBtn, { backgroundColor: colors.primary }]}
                >
                  <Icon name="plus" size={16} color="#fff" />
                </Pressable>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enterCard(340)} style={{ marginTop: 14 }}>
            <GlassCard padding={18}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Timeline</Text>
              <View style={styles.timelineRow}>
                <View style={[styles.tlDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tlTitle, { color: colors.textPrimary }]}>Created</Text>
                  <Text style={[styles.tlSub, { color: colors.textMuted }]}>
                    {formatRelative(task.createdAt)}
                  </Text>
                </View>
              </View>
              {task.dueDate ? (
                <View style={styles.timelineRow}>
                  <View style={[styles.tlDot, { backgroundColor: colors.warning }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tlTitle, { color: colors.textPrimary }]}>Due</Text>
                    <Text style={[styles.tlSub, { color: colors.textMuted }]}>
                      {formatDue(task.dueDate)}
                    </Text>
                  </View>
                </View>
              ) : null}
              {task.completed ? (
                <View style={styles.timelineRow}>
                  <View style={[styles.tlDot, { backgroundColor: colors.success }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tlTitle, { color: colors.textPrimary }]}>Completed</Text>
                  </View>
                </View>
              ) : null}
            </GlassCard>
          </Animated.View>

          <View style={styles.navRow}>
            <GhostButton
              style={styles.navBtn}
              label="Previous"
              icon={<Icon name="chevron-left" size={16} color={colors.textPrimary} />}
              onPress={() =>
                prev
                  ? navigation.replace('TaskDetails', { taskId: prev.id })
                  : haptic.warning()
              }
            />
            <View style={{ width: 12 }} />
            <GhostButton
              style={styles.navBtn}
              label="Next"
              icon={<Icon name="chevron-right" size={16} color={colors.textPrimary} />}
              onPress={() =>
                next
                  ? navigation.replace('TaskDetails', { taskId: next.id })
                  : haptic.warning()
              }
            />
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  priDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 8,
    marginRight: 12,
  },
  titleText: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  strike: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 17,
    fontWeight: '700',
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  statusBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 14,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  barCaption: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  notes: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '500',
  },
  addSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  subInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  addSubBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tlDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 14,
  },
  tlTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  tlSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    marginTop: 22,
  },
  navBtn: {
    flex: 1,
  },
});

export default TaskDetailsScreen;
