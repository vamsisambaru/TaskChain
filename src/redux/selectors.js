import { createSelector } from '@reduxjs/toolkit';
import {
  sortByDueDate,
  sortByPriority,
  sortByCreatedAt,
  sortByTitle,
  PriorityQueue,
  computeScore,
} from '../dsa';

const selectTasksState = (s) => s.tasks;

export const selectAllTasks = (s) => s.tasks.items;

const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const isUpcoming = (iso) => {
  if (!iso) return false;
  return new Date(iso).getTime() > Date.now();
};

export const selectFilteredTasks = createSelector(
  [selectTasksState],
  ({ items, filter, search, sortMode }) => {
    let arr = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes || '').toLowerCase().includes(q),
      );
    }
    switch (filter) {
      case 'today':
        arr = arr.filter((t) => !t.completed && isToday(t.dueDate));
        break;
      case 'upcoming':
        arr = arr.filter((t) => !t.completed && isUpcoming(t.dueDate));
        break;
      case 'completed':
        arr = arr.filter((t) => t.completed);
        break;
      default:
        break;
    }
    switch (sortMode) {
      case 'due':
        return sortByDueDate(arr);
      case 'priority':
        return sortByPriority(arr);
      case 'created':
        return sortByCreatedAt(arr);
      case 'title':
        return sortByTitle(arr);
      case 'smart': {
        const open = arr.filter((t) => !t.completed);
        const done = arr.filter((t) => t.completed);
        return PriorityQueue.from(open, computeScore).toSortedArray().concat(done);
      }
      default:
        return arr;
    }
  },
);

export const selectStats = createSelector([selectAllTasks], (items) => {
  const total = items.length;
  const completed = items.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = items.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < Date.now(),
  ).length;
  const todayCount = items.filter((t) => !t.completed && isToday(t.dueDate)).length;
  const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, todayCount, productivity };
});

export const selectWeeklyCompletion = createSelector([selectAllTasks], (items) => {
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = items.filter(
      (t) =>
        t.completed &&
        t.createdAt >= d.getTime() &&
        t.createdAt < next.getTime(),
    ).length;
    days.push({
      key: d.toISOString().slice(0, 10),
      label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
      count,
    });
  }
  return days;
});

export const selectPriorityDistribution = createSelector([selectAllTasks], (items) => {
  const counts = { high: 0, medium: 0, low: 0 };
  items.forEach((t) => {
    if (counts[t.priority] !== undefined) counts[t.priority] += 1;
  });
  return counts;
});

export const selectCategoryDistribution = createSelector([selectAllTasks], (items) => {
  const counts = {};
  items.forEach((t) => {
    counts[t.category] = (counts[t.category] || 0) + 1;
  });
  return counts;
});

export const selectActivity = (s) => s.tasks.activity;
export const selectUndoSize = (s) => s.tasks.undoSize;
export const selectHydrated = (s) => s.tasks.hydrated && s.auth.hydrated;
