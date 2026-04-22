import * as Keychain from 'react-native-keychain';

import type { Tokens } from '../types/app';

const AUTH_SERVICE = 'strength-pilot-auth';
const AUTH_ACCOUNT = 'session';

export async function getSecureTokens(): Promise<Tokens | null> {
  const credentials = await Keychain.getGenericPassword({ service: AUTH_SERVICE });
  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as Tokens;
  } catch {
    return null;
  }
}

export async function setSecureTokens(tokens: Tokens): Promise<void> {
  await Keychain.setGenericPassword(AUTH_ACCOUNT, JSON.stringify(tokens), {
    service: AUTH_SERVICE,
  });
}

export async function clearSecureTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: AUTH_SERVICE });
}
