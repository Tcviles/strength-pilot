import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';
import { ActionButton } from '../shared/ActionButton';

export function AuthCard() {
  const { palette } = useTheme();
  const {
    mode,
    email,
    password,
    confirmPassword,
    newPassword,
    resetCode,
    resetPassword,
    resetPasswordConfirm,
    requiresNewPassword,
    forgotPasswordStep,
    loading,
    setMode: onModeChange,
    setEmail: onEmailChange,
    setPassword: onPasswordChange,
    setConfirmPassword: onConfirmPasswordChange,
    setNewPassword: onNewPasswordChange,
    setResetCode: onResetCodeChange,
    setResetPassword: onResetPasswordChange,
    setResetPasswordConfirm: onResetPasswordConfirmChange,
    startForgotPassword: onStartForgotPassword,
    cancelForgotPassword: onCancelForgotPassword,
    requestPasswordReset,
    confirmPasswordReset,
    signIn,
    completeNewPassword,
    signUp,
  } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [resetPasswordConfirmVisible, setResetPasswordConfirmVisible] = useState(false);
  const isForgotPassword = forgotPasswordStep > 0;

  return (
    <View style={[styles.authCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        keyboardType="email-address"
        placeholder="Email address"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={email}
        onChangeText={onEmailChange}
      />
      {!requiresNewPassword && forgotPasswordStep === 1 ? null : !requiresNewPassword && forgotPasswordStep === 2 ? (
        <View
          style={[
            styles.inputRow,
            { borderColor: palette.line, backgroundColor: palette.input },
          ]}
        >
          <TextInput
            editable={!loading}
            placeholder="Verification code"
            placeholderTextColor={palette.placeholder}
            style={[styles.inputField, { color: palette.text }]}
            value={resetCode}
            onChangeText={onResetCodeChange}
          />
        </View>
      ) : (
        <View
          style={[
            styles.inputRow,
            { borderColor: palette.line, backgroundColor: palette.input },
          ]}
        >
          <TextInput
            editable={!loading}
            secureTextEntry={!passwordVisible}
            placeholder="Password"
            placeholderTextColor={palette.placeholder}
            style={[styles.inputField, { color: palette.text }]}
            value={password}
            onChangeText={onPasswordChange}
          />
          <Pressable disabled={loading} onPress={() => setPasswordVisible((value) => !value)} style={styles.eyeButton}>
            <Text style={[styles.eyeButtonText, { color: palette.accent }]}>
              {passwordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>
      )}
      {!requiresNewPassword && !isForgotPassword && mode === 'signUp' ? (
        <View
          style={[
            styles.inputRow,
            { borderColor: palette.line, backgroundColor: palette.input },
          ]}
        >
          <TextInput
            editable={!loading}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirm password"
            placeholderTextColor={palette.placeholder}
            style={[styles.inputField, { color: palette.text }]}
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
          />
          <Pressable disabled={loading} onPress={() => setConfirmPasswordVisible((value) => !value)} style={styles.eyeButton}>
            <Text style={[styles.eyeButtonText, { color: palette.accent }]}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {requiresNewPassword ? (
        <View
          style={[
            styles.inputRow,
            { borderColor: palette.line, backgroundColor: palette.input },
          ]}
        >
          <TextInput
            editable={!loading}
            secureTextEntry={!newPasswordVisible}
            placeholder="New permanent password"
            placeholderTextColor={palette.placeholder}
            style={[styles.inputField, { color: palette.text }]}
            value={newPassword}
            onChangeText={onNewPasswordChange}
          />
          <Pressable disabled={loading} onPress={() => setNewPasswordVisible((value) => !value)} style={styles.eyeButton}>
            <Text style={[styles.eyeButtonText, { color: palette.accent }]}>
              {newPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {!requiresNewPassword && forgotPasswordStep === 2 ? (
        <>
          <View
            style={[
              styles.inputRow,
              { borderColor: palette.line, backgroundColor: palette.input },
            ]}
          >
            <TextInput
              editable={!loading}
              secureTextEntry={!resetPasswordVisible}
              placeholder="New password"
              placeholderTextColor={palette.placeholder}
              style={[styles.inputField, { color: palette.text }]}
              value={resetPassword}
              onChangeText={onResetPasswordChange}
            />
            <Pressable disabled={loading} onPress={() => setResetPasswordVisible((value) => !value)} style={styles.eyeButton}>
              <Text style={[styles.eyeButtonText, { color: palette.accent }]}>
                {resetPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>
          <View
            style={[
              styles.inputRow,
              { borderColor: palette.line, backgroundColor: palette.input },
            ]}
          >
            <TextInput
              editable={!loading}
              secureTextEntry={!resetPasswordConfirmVisible}
              placeholder="Confirm new password"
              placeholderTextColor={palette.placeholder}
              style={[styles.inputField, { color: palette.text }]}
              value={resetPasswordConfirm}
              onChangeText={onResetPasswordConfirmChange}
            />
            <Pressable disabled={loading} onPress={() => setResetPasswordConfirmVisible((value) => !value)} style={styles.eyeButton}>
              <Text style={[styles.eyeButtonText, { color: palette.accent }]}>
                {resetPasswordConfirmVisible ? 'Hide' : 'Show'}
              </Text>
            </Pressable>
          </View>
        </>
      ) : null}
      {requiresNewPassword ? (
        <ActionButton
          label="Lock In Password"
          disabled={loading || !newPassword}
          onPress={() => completeNewPassword().catch(() => undefined)}
        />
      ) : forgotPasswordStep === 1 ? (
        <ActionButton
          label="Send Reset Code"
          disabled={loading || !email.trim()}
          onPress={() => requestPasswordReset().catch(() => undefined)}
        />
      ) : forgotPasswordStep === 2 ? (
        <ActionButton
          label="Confirm Reset"
          disabled={loading || !email.trim() || !resetCode.trim() || !resetPassword || !resetPasswordConfirm}
          onPress={() => confirmPasswordReset().catch(() => undefined)}
        />
      ) : mode === 'signIn' ? (
        <ActionButton
          label="Sign In"
          disabled={loading || !email || !password}
          onPress={() => signIn().catch(() => undefined)}
        />
      ) : (
        <ActionButton
          label="Create Account"
          disabled={loading || !email || !password || !confirmPassword}
          onPress={() => signUp().catch(() => undefined)}
        />
      )}
      {!requiresNewPassword && mode === 'signIn' ? (
        <Pressable disabled={loading} style={styles.authHelperLink} onPress={onStartForgotPassword}>
          <Text style={[styles.authHelperText, { color: palette.muted }]}>Forgot password?</Text>
        </Pressable>
      ) : null}
      {isForgotPassword ? (
        <Pressable disabled={loading} style={styles.authHelperLink} onPress={onCancelForgotPassword}>
          <Text style={[styles.authHelperText, { color: palette.muted }]}>Back to sign in</Text>
        </Pressable>
      ) : null}
      {!requiresNewPassword && !isForgotPassword ? (
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: palette.muted }]}>
            {mode === 'signIn' ? 'Need an account?' : 'Already have an account?'}
          </Text>
          <Pressable disabled={loading} onPress={() => onModeChange(mode === 'signIn' ? 'signUp' : 'signIn')}>
            <Text style={[styles.switchLink, { color: palette.accent }]}>
              {mode === 'signIn' ? 'Sign up' : 'Sign in'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
