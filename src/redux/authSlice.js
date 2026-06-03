import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage, KEYS } from '../services/storage';

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const user = await storage.get(KEYS.user, null);
  const onboarded = await storage.get(KEYS.onboarded, false);
  return { user, onboarded };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    onboarded: false,
    hydrated: false,
  },
  reducers: {
    signIn(state, action) {
      state.user = action.payload;
      storage.set(KEYS.user, action.payload);
    },
    signOut(state) {
      state.user = null;
      storage.remove(KEYS.user);
    },
    completeOnboarding(state) {
      state.onboarded = true;
      storage.set(KEYS.onboarded, true);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.onboarded = action.payload.onboarded;
      state.hydrated = true;
    });
  },
});

export const { signIn, signOut, completeOnboarding } = authSlice.actions;
export default authSlice.reducer;
