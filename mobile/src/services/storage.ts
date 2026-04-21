import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'strength-pilot',
});

export const STORAGE_KEYS = {
  authTokens: 'auth.tokens',
  workoutSession: 'workout.session',
} as const;

export function setStoredObject<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function getStoredObject<T>(key: string): T | null {
  const rawValue = storage.getString(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function removeStoredValue(key: string) {
  storage.remove(key);
}

export { storage };
