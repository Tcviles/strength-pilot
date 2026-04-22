import * as Keychain from 'react-native-keychain';

const STORAGE_SERVICES = {
  workoutSession: 'strength-pilot-workout-session',
  guestPreferences: 'strength-pilot-guest-preferences',
} as const;

const STORAGE_ACCOUNT = 'app-state';

export const STORAGE_KEYS = {
  workoutSession: 'workoutSession',
  guestPreferences: 'guestPreferences',
} as const;

function getServiceForKey(key: string) {
  return STORAGE_SERVICES[key as keyof typeof STORAGE_SERVICES];
}

export async function setStoredObject<T>(key: string, value: T) {
  const service = getServiceForKey(key);
  if (!service) {
    return;
  }

  await Keychain.setGenericPassword(STORAGE_ACCOUNT, JSON.stringify(value), {
    service,
  });
}

export async function getStoredObject<T>(key: string): Promise<T | null> {
  const service = getServiceForKey(key);
  if (!service) {
    return null;
  }

  const credentials = await Keychain.getGenericPassword({ service });
  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as T;
  } catch {
    return null;
  }
}

export async function removeStoredValue(key: string) {
  const service = getServiceForKey(key);
  if (!service) {
    return;
  }

  await Keychain.resetGenericPassword({ service });
}
