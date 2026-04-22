import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { CONFIG } from '../config/appConfig';
import { cognitoRequest } from '../services/api';
import { clearSecureTokens, getSecureTokens, setSecureTokens } from '../services/secureAuthStorage';
import type { Tokens } from '../types/app';

type AuthMode = 'signIn' | 'signUp';

type AuthContextValue = {
  mode: AuthMode;
  tokens: Tokens | null;
  email: string;
  password: string;
  confirmPassword: string;
  newPassword: string;
  resetCode: string;
  resetPassword: string;
  resetPasswordConfirm: string;
  requiresNewPassword: boolean;
  forgotPasswordStep: 0 | 1 | 2;
  hydrating: boolean;
  loading: boolean;
  status: string;
  error: string;
  setMode: (value: AuthMode) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setResetCode: (value: string) => void;
  setResetPassword: (value: string) => void;
  setResetPasswordConfirm: (value: string) => void;
  startForgotPassword: () => void;
  cancelForgotPassword: () => void;
  requestPasswordReset: () => Promise<string>;
  confirmPasswordReset: () => Promise<string>;
  signIn: () => Promise<string>;
  completeNewPassword: () => Promise<string>;
  signUp: () => Promise<string>;
  signOut: () => void;
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [authSession, setAuthSession] = useState('');
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<0 | 1 | 2>(0);
  const [hydrating, setHydrating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const hydrateTokens = async () => {
      const storedTokens = await getSecureTokens();
      if (!cancelled && storedTokens?.idToken && storedTokens?.accessToken) {
        setTokens(storedTokens);
        setStatus('Signed in.');
      }
      if (!cancelled) {
        setHydrating(false);
      }
    };

    hydrateTokens().catch(() => {
      if (!cancelled) {
        setHydrating(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrating) {
      return;
    }

    const persistTokens = async () => {
      if (tokens?.idToken && tokens.accessToken) {
        await setSecureTokens(tokens);
        return;
      }

      await clearSecureTokens();
    };

    persistTokens().catch(() => undefined);
  }, [tokens, hydrating]);

  const resetForgotPasswordState = useCallback(() => {
    setResetCode('');
    setResetPassword('');
    setResetPasswordConfirm('');
  }, []);

  const setModeWithReset = useCallback((value: AuthMode) => {
    setMode(value);
    setConfirmPassword('');
    setForgotPasswordStep(0);
    resetForgotPasswordState();
    setError('');
    setStatus('Ready');
  }, [resetForgotPasswordState]);

  const startForgotPassword = useCallback(() => {
    setForgotPasswordStep(1);
    resetForgotPasswordState();
    setError('');
    setStatus('Reset your password');
  }, [resetForgotPasswordState]);

  const cancelForgotPassword = useCallback(() => {
    setForgotPasswordStep(0);
    resetForgotPasswordState();
    setError('');
    setStatus('Ready');
  }, [resetForgotPasswordState]);

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
    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.';
      setError(message);
      throw new Error(message);
    }

    if (password !== confirmPassword) {
      const message = 'Passwords do not match.';
      setError(message);
      throw new Error(message);
    }

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
      setConfirmPassword('');
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
  }, [confirmPassword, email, password]);

  const requestPasswordReset = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatus('Sending reset code...');
    try {
      console.log('[StrengthPilot] Forgot password request', {
        email: maskEmail(email.trim()),
      });

      const response = await cognitoRequest('AWSCognitoIdentityProviderService.ForgotPassword', {
        ClientId: CONFIG.userPoolClientId,
        Username: email.trim(),
      });

      console.log('[StrengthPilot] Forgot password response', {
        delivery: response.CodeDeliveryDetails?.Destination,
      });
      setForgotPasswordStep(2);
      setStatus('Check your email for the reset code.');
      return 'Check your email for the reset code.';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to send reset code.';
      console.log('[StrengthPilot] Forgot password request failed', {
        email: maskEmail(email.trim()),
        message,
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [email]);

  const confirmPasswordReset = useCallback(async () => {
    if (resetPassword.length < 8) {
      const message = 'New password must be at least 8 characters.';
      setError(message);
      throw new Error(message);
    }
    if (resetPassword !== resetPasswordConfirm) {
      const message = 'Passwords do not match.';
      setError(message);
      throw new Error(message);
    }

    setLoading(true);
    setError('');
    setStatus('Confirming password reset...');
    try {
      console.log('[StrengthPilot] Confirm forgot password', {
        email: maskEmail(email.trim()),
        codeLength: resetCode.length,
        resetPasswordLength: resetPassword.length,
      });

      await cognitoRequest('AWSCognitoIdentityProviderService.ConfirmForgotPassword', {
        ClientId: CONFIG.userPoolClientId,
        Username: email.trim(),
        ConfirmationCode: resetCode.trim(),
        Password: resetPassword,
      });

      setForgotPasswordStep(0);
      resetForgotPasswordState();
      setMode('signIn');
      setStatus('Password reset successful. Sign in with your new password.');
      return 'Password reset successful. Sign in with your new password.';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reset password.';
      console.log('[StrengthPilot] Confirm forgot password failed', {
        email: maskEmail(email.trim()),
        message,
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [email, resetCode, resetPassword, resetPasswordConfirm, resetForgotPasswordState]);

  const signOut = useCallback(() => {
    setTokens(null);
    setRequiresNewPassword(false);
    setAuthSession('');
    setForgotPasswordStep(0);
    setConfirmPassword('');
    setNewPassword('');
    resetForgotPasswordState();
    setMode('signIn');
    setStatus('Signed out.');
    setError('');
  }, [resetForgotPasswordState]);

  const value = useMemo(
    () => ({
      mode,
      tokens,
      email,
      password,
      confirmPassword,
      newPassword,
      resetCode,
      resetPassword,
      resetPasswordConfirm,
      requiresNewPassword,
      forgotPasswordStep,
      hydrating,
      loading,
      status,
      error,
      setMode: setModeWithReset,
      setEmail,
      setPassword,
      setConfirmPassword,
      setNewPassword,
      setResetCode,
      setResetPassword,
      setResetPasswordConfirm,
      startForgotPassword,
      cancelForgotPassword,
      requestPasswordReset,
      confirmPasswordReset,
      signIn,
      completeNewPassword,
      signUp,
      signOut,
    }),
    [
      mode,
      tokens,
      email,
      password,
      confirmPassword,
      newPassword,
      resetCode,
      resetPassword,
      resetPasswordConfirm,
      requiresNewPassword,
      forgotPasswordStep,
      hydrating,
      loading,
      status,
      error,
      setModeWithReset,
      startForgotPassword,
      cancelForgotPassword,
      requestPasswordReset,
      confirmPasswordReset,
      signIn,
      completeNewPassword,
      signUp,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
