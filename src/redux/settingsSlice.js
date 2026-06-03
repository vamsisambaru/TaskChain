import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage, KEYS } from '../services/storage';

const defaults = {
  darkMode: true,
  notifications: true,
  haptics: true,
  weekStartsOn: 1,
  reminderTime: '09:00',
  showCompleted: true,
};

export const hydrateSettings = createAsyncThunk('settings/hydrate', async () => {
  const s = await storage.get(KEYS.settings, defaults);
  return { ...defaults, ...s };
});

const persist = (state) => storage.set(KEYS.settings, state);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaults,
  reducers: {
    updateSetting(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
      persist(state);
    },
    toggleSetting(state, action) {
      const key = action.payload;
      state[key] = !state[key];
      persist(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateSettings.fulfilled, (_state, action) => action.payload);
  },
});

export const { updateSetting, toggleSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
