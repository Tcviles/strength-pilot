import React, { createContext, useCallback, useMemo, useState } from 'react';

import { CONFIG } from '../config/appConfig';
import { cognitoRequest } from '../services/api';
import type { Tokens } from '../types/app';

type AuthMode = 'signIn' | 'signUp';

type AuthContextValue = {
  mode: AuthMode;
  tokens: Tokens | null;
  email: string;
  password: string;
  newPassword: string;
  requiresNewPassword: boolean;
  loading: boolean;
  status: string;
  error: string;
  setMode: (value: AuthMode) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  signIn: () => Promise<string>;
  completeNewPassword: () => Promise<string>;
  signUp: () => Promise<string>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function maskEmail(value: string) {
  const [name, domain] = value.split('@');
  if (!name || !domain) {
    return value;
  }
  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(name.length - 2, 1))}@${domain}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authSession, setAuthSession] = useState('');
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');

  const signIn = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatus('Signing in...');
    try {
      console.log('[StrengthPilot] Sign-in attempt', {
        email: maskEmail(email.trim()),
        passwordLength: password.length,
      });

      const response = await cognitoRequest('AWSCognitoIdentityProviderService.InitiateAuth', {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CONFIG.userPoolClientId,
        AuthParameters: {
          USERNAME: email.trim(),
          PASSWORD: password,
        },
      });

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log('[StrengthPilot] Sign-in challenge', {
          challengeName: response.ChallengeName,
        });
        setAuthSession(response.Session || '');
        setRequiresNewPassword(true);
        setStatus('Set your permanent password to continue.');
        return 'Set your permanent password to continue.';
      }

      const authTokens = response.AuthenticationResult;
      if (!authTokens?.IdToken || !authTokens?.AccessToken) {
        throw new Error('Cognito did not return usable tokens.');
      }

      setTokens({
        idToken: authTokens.IdToken,
        accessToken: authTokens.AccessToken,
        refreshToken: authTokens.RefreshToken,
      });
      console.log('[StrengthPilot] Sign-in success', {
        email: maskEmail(email.trim()),
      });
      setStatus('Signed in.');
      return 'Signed in.';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      console.log('[StrengthPilot] Sign-in failure', {
        email: maskEmail(email.trim()),
        message,
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const completeNewPassword = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatus('Completing first sign in...');
    try {
      console.log('[StrengthPilot] Completing new password challenge', {
        email: maskEmail(email.trim()),
        newPasswordLength: newPassword.length,
      });

      const response = await cognitoRequest(
        'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
        {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: CONFIG.userPoolClientId,
          Session: authSession,
          ChallengeResponses: {
            USERNAME: email.trim(),
            NEW_PASSWORD: newPassword,
          },
        },
      );

      const authTokens = response.AuthenticationResult;
      if (!authTokens?.IdToken || !authTokens?.AccessToken) {
        throw new Error('Password changed, but tokens were not returned.');
      }

      setRequiresNewPassword(false);
      setNewPassword('');
      setTokens({
        idToken: authTokens.IdToken,
        accessToken: authTokens.AccessToken,
        refreshToken: authTokens.RefreshToken,
      });
      console.log('[StrengthPilot] New password challenge complete', {
        email: maskEmail(email.trim()),
      });
      setStatus('Password locked in.');
      return 'Password locked in.';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update password.';
      console.log('[StrengthPilot] New password challenge failed', {
        email: maskEmail(email.trim()),
        message,
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authSession, email, newPassword]);

  const signUp = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatus('Creating account...');
    try {
      console.log('[StrengthPilot] Sign-up attempt', {
        email: maskEmail(email.trim()),
        passwordLength: password.length,
      });

      await cognitoRequest('AWSCognitoIdentityProviderService.SignUp', {
        ClientId: CONFIG.userPoolClientId,
        Username: email.trim(),
        Password: password,
        UserAttributes: [{ Name: 'email', Value: email.trim() }],
      });
      setMode('signIn');
      console.log('[StrengthPilot] Sign-up success', {
        email: maskEmail(email.trim()),
      });
      setStatus('Account created. Sign in to continue.');
      return 'Account created. Sign in to continue.';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign up.';
      console.log('[StrengthPilot] Sign-up failure', {
        email: maskEmail(email.trim()),
        message,
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const value = useMemo(
    () => ({
      mode,
      tokens,
      email,
      password,
      newPassword,
      requiresNewPassword,
      loading,
      status,
      error,
      setMode,
      setEmail,
      setPassword,
      setNewPassword,
      signIn,
      completeNewPassword,
      signUp,
    }),
    [
      mode,
      tokens,
      email,
      password,
      newPassword,
      requiresNewPassword,
      loading,
      status,
      error,
      signIn,
      completeNewPassword,
      signUp,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
