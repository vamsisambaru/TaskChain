import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Background from '../components/Background';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import FAB from '../components/FAB';
import SegmentedControl from '../components/SegmentedControl';
import Pill from '../components/Pill';
import Icon from '../components/Icon';
import AddTaskSheet from './AddTaskSheet';

import useTheme from '../hooks/useTheme';
import { selectFilteredTasks, selectUndoSize } from '../redux/selectors';
import {
  toggleTask,
  deleteTask,
  undoDelete,
  setFilter,
  setSortMode,
  setSearch,
  hydrateTasks,
} from '../redux/tasksSlice';
import { FILTER_TABS, SORT_MODES } from '../constants/categories';
import { enterUp } from '../animations/transitions';
import { haptic } from '../utils/haptics';

const TasksScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const tasks = useSelector(selectFilteredTasks);
  const filter = useSelector((s) => s.tasks.filter);
  const sortMode = useSelector((s) => s.tasks.sortMode);
  const search = useSelector((s) => s.tasks.search);
  const undoSize = useSelector(selectUndoSize);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(hydrateTasks());
    setRefreshing(false);
  }, [dispatch]);

  return (
    <Background>
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        <Animated.View entering={enterUp(0)} style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Tasks</Text>
          <View style={styles.actions}>
            {undoSize > 0 ? (
              <Pressable
                onPress={() => {
                  haptic.success();
                  dispatch(undoDelete());
                }}
                style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}
                hitSlop={6}
              >
                <Icon name="rotate-ccw" size={16} color={colors.primary} />
                <Text style={{ marginLeft: 6, fontSize: 12, fontWeight: '700', color: colors.primary }}>
                  Undo · {undoSize}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Animated.View>

        <Animated.View entering={enterUp(80)} style={styles.searchWrap}>
          <View
            style={[
              styles.search,
              { backgroundColor: colors.bgSurface, borderColor: colors.border },
            ]}
          >
            <Icon name="search" size={16} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={(v) => dispatch(setSearch(v))}
              placeholder="Search your chain"
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              selectionColor={colors.primary}
            />
            {search ? (
              <Pressable onPress={() => dispatch(setSearch(''))} hitSlop={8}>
                <Icon name="x" size={14} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>

        <Animated.View entering={enterUp(140)} style={styles.tabsWrap}>
          <SegmentedControl
            items={FILTER_TABS}
            value={filter}
            onChange={(v) => dispatch(setFilter(v))}
          />
        </Animated.View>

        <Animated.View entering={enterUp(200)} style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: colors.textMuted }]}>Sort</Text>
          {SORT_MODES.map((m) => (
            <Pill
              key={m.id}
              label={m.label}
              active={sortMode === m.id}
              onPress={() => dispatch(setSortMode(m.id))}
            />
          ))}
        </Animated.View>

        <FlatList
          data={tasks}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={(t) => navigation.navigate('TaskDetails', { taskId: t.id })}
              onToggle={(id) => dispatch(toggleTask(id))}
              onDelete={(id) => dispatch(deleteTask(id))}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={search ? 'search' : 'sun'}
              title={search ? 'No matches' : "You're clear"}
              subtitle={
                search
                  ? 'Try a different keyword or clear your search.'
                  : 'Tap the + button to start your first chain.'
              }
            />
          }
        />
      </View>
      <FAB onPress={() => setSheetOpen(true)} />
      <AddTaskSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Background>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  tabsWrap: {
    paddingHorizontal: 20,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginRight: 10,
  },
});

export default TasksScreen;
