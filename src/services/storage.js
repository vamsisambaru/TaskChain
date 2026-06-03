import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  tasks: '@taskchain/tasks',
  activity: '@taskchain/activity',
  settings: '@taskchain/settings',
  user: '@taskchain/user',
  onboarded: '@taskchain/onboarded',
};

export const storage = {
  async get(key, fallback = null) {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // swallow — storage failure shouldn't crash the app
    }
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },
};

export { KEYS };
