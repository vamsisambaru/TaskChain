import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskStore from '../services/TaskStore';
import { storage, KEYS } from '../services/storage';

const persist = async () => {
  await storage.set(KEYS.tasks, taskStore.toArray());
  await storage.set(KEYS.activity, taskStore.activity());
};

const snapshot = () => ({
  items: taskStore.toArray(),
  activity: taskStore.activity(),
  undoSize: taskStore.undoSize(),
});

// IDs of demo tasks shipped in early builds. Stripped from existing installs on
// next hydrate; user-created tasks all start with `t-` so this never matches them.
const STALE_SEED_IDS = new Set(['s1', 's2', 's3', 's4']);

export const hydrateTasks = createAsyncThunk('tasks/hydrate', async () => {
  const storedTasks = await storage.get(KEYS.tasks, []);
  const storedActivity = await storage.get(KEYS.activity, []);

  const tasks = storedTasks.filter((t) => !STALE_SEED_IDS.has(t.id));
  const activity = storedActivity.filter((a) => !STALE_SEED_IDS.has(a.taskId));

  if (tasks.length !== storedTasks.length) {
    await storage.set(KEYS.tasks, tasks);
  }
  if (activity.length !== storedActivity.length) {
    await storage.set(KEYS.activity, activity);
  }

  taskStore.hydrate(tasks, activity);
  return snapshot();
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    activity: [],
    undoSize: 0,
    sortMode: 'smart',
    filter: 'all',
    search: '',
    hydrated: false,
  },
  reducers: {
    addTask: {
      reducer(state, action) {
        taskStore.add(action.payload);
        const s = snapshot();
        state.items = s.items;
        state.activity = s.activity;
        state.undoSize = s.undoSize;
        persist();
      },
      prepare(input) {
        return {
          payload: {
            id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            title: input.title,
            notes: input.notes || '',
            category: input.category || 'work',
            priority: input.priority || 'medium',
            completed: false,
            dueDate: input.dueDate || null,
            createdAt: Date.now(),
            subtasks: input.subtasks || [],
          },
        };
      },
    },
    updateTask(state, action) {
      const { id, patch } = action.payload;
      taskStore.update(id, patch);
      const s = snapshot();
      state.items = s.items;
      state.activity = s.activity;
      persist();
    },
    toggleTask(state, action) {
      const id = action.payload;
      const task = taskStore.list.findById(id);
      if (task) {
        taskStore.update(id, { completed: !task.completed });
      }
      const s = snapshot();
      state.items = s.items;
      state.activity = s.activity;
      persist();
    },
    deleteTask(state, action) {
      taskStore.remove(action.payload);
      const s = snapshot();
      state.items = s.items;
      state.activity = s.activity;
      state.undoSize = s.undoSize;
      persist();
    },
    undoDelete(state) {
      taskStore.undoDelete();
      const s = snapshot();
      state.items = s.items;
      state.activity = s.activity;
      state.undoSize = s.undoSize;
      persist();
    },
    reorderTasks(state, action) {
      taskStore.reorder(action.payload);
      const s = snapshot();
      state.items = s.items;
      persist();
    },
    addSubtask(state, action) {
      const { taskId, subtask } = action.payload;
      const task = taskStore.list.findById(taskId);
      if (task) {
        const next = [...task.subtasks, subtask];
        taskStore.update(taskId, { subtasks: next });
      }
      const s = snapshot();
      state.items = s.items;
      persist();
    },
    toggleSubtask(state, action) {
      const { taskId, subtaskId } = action.payload;
      const task = taskStore.list.findById(taskId);
      if (task) {
        const next = task.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st,
        );
        taskStore.update(taskId, { subtasks: next });
      }
      const s = snapshot();
      state.items = s.items;
      persist();
    },
    setSortMode(state, action) {
      state.sortMode = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateTasks.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.activity = action.payload.activity;
      state.undoSize = action.payload.undoSize;
      state.hydrated = true;
    });
  },
});

export const {
  addTask,
  updateTask,
  toggleTask,
  deleteTask,
  undoDelete,
  reorderTasks,
  addSubtask,
  toggleSubtask,
  setSortMode,
  setFilter,
  setSearch,
} = tasksSlice.actions;

export default tasksSlice.reducer;
