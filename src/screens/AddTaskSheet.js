import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import BottomSheet from '../components/BottomSheet';
import FloatingInput from '../components/FloatingInput';
import GradientButton from '../components/GradientButton';
import Pill from '../components/Pill';
import Icon from '../components/Icon';
import useTheme from '../hooks/useTheme';
import { CATEGORIES, PRIORITIES } from '../constants/categories';
import { addTask } from '../redux/tasksSlice';
import { haptic } from '../utils/haptics';

const DUE_PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'week', label: 'In a week' },
  { id: 'none', label: 'No date' },
];

const computeDue = (preset) => {
  const d = new Date();
  d.setHours(18, 0, 0, 0);
  if (preset === 'today') return d.toISOString();
  if (preset === 'tomorrow') {
    d.setDate(d.getDate() + 1);
    return d.toISOString();
  }
  if (preset === 'week') {
    d.setDate(d.getDate() + 7);
    return d.toISOString();
  }
  return null;
};

const AddTaskSheet = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState('today');

  const reset = () => {
    setTitle('');
    setNotes('');
    setCategory('work');
    setPriority('medium');
    setDue('today');
  };

  const submit = () => {
    if (!title.trim()) {
      haptic.warning();
      return;
    }
    dispatch(
      addTask({
        title: title.trim(),
        notes: notes.trim(),
        category,
        priority,
        dueDate: computeDue(due),
      }),
    );
    haptic.success();
    reset();
    onClose?.();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={620}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>New task</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Captured tasks land at the head of the linked list.
        </Text>

        <View style={{ height: 18 }} />
        <FloatingInput
          label="What's on your mind?"
          value={title}
          onChangeText={setTitle}
          icon="edit-3"
          autoCapitalize="sentences"
        />
        <View style={{ height: 12 }} />
        <FloatingInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          icon="align-left"
          autoCapitalize="sentences"
        />

        <Text style={[styles.section, { color: colors.textMuted }]}>Category</Text>
        <View style={styles.row}>
          {CATEGORIES.map((c) => (
            <Pill
              key={c.id}
              label={c.label}
              icon={c.icon}
              color={c.color}
              active={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>

        <Text style={[styles.section, { color: colors.textMuted }]}>Priority</Text>
        <View style={styles.row}>
          {PRIORITIES.map((p) => (
            <Pill
              key={p.id}
              label={p.label}
              color={p.color}
              active={priority === p.id}
              onPress={() => setPriority(p.id)}
            />
          ))}
        </View>

        <Text style={[styles.section, { color: colors.textMuted }]}>Due</Text>
        <View style={styles.row}>
          {DUE_PRESETS.map((d) => (
            <Pill
              key={d.id}
              label={d.label}
              active={due === d.id}
              onPress={() => setDue(d.id)}
            />
          ))}
        </View>

        <View style={{ height: 24 }} />
        <GradientButton
          label="Add to chain"
          onPress={submit}
          icon={<Icon name="plus" size={18} color="#fff" />}
        />
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  section: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
});

export default AddTaskSheet;
