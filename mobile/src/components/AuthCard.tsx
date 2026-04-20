import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';
import { ActionButton } from './ActionButton';
import { SectionHeading } from './SectionHeading';

type Props = {
  palette: Palette;
  email: string;
  password: string;
  newPassword: string;
  requiresNewPassword: boolean;
  loading: boolean;
  mode: 'signIn' | 'signUp';
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onModeChange: (value: 'signIn' | 'signUp') => void;
  onSignIn: () => void;
  onCompleteNewPassword: () => void;
  onSignUp: () => void;
};

export function AuthCard({
  palette,
  email,
  password,
  newPassword,
  requiresNewPassword,
  loading,
  mode,
  onEmailChange,
  onPasswordChange,
  onNewPasswordChange,
  onModeChange,
  onSignIn,
  onCompleteNewPassword,
  onSignUp,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <SectionHeading palette={palette} eyebrow="Access" title="Get into the cockpit" />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email address"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={email}
        onChangeText={onEmailChange}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={password}
        onChangeText={onPasswordChange}
      />
      {requiresNewPassword ? (
        <TextInput
          secureTextEntry
          placeholder="New permanent password"
          placeholderTextColor={palette.placeholder}
          style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
          value={newPassword}
          onChangeText={onNewPasswordChange}
        />
      ) : null}
      {requiresNewPassword ? (
        <ActionButton
          palette={palette}
          label="Lock In Password"
          disabled={loading || !newPassword}
          onPress={onCompleteNewPassword}
        />
      ) : mode === 'signIn' ? (
        <ActionButton
          palette={palette}
          label="Sign In"
          disabled={loading || !email || !password}
          onPress={onSignIn}
        />
      ) : (
        <ActionButton
          palette={palette}
          label="Create Account"
          disabled={loading || !email || !password}
          onPress={onSignUp}
        />
      )}
      {!requiresNewPassword ? (
        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: palette.muted }]}>
            {mode === 'signIn' ? 'Need an account?' : 'Already have an account?'}
          </Text>
          <Pressable onPress={() => onModeChange(mode === 'signIn' ? 'signUp' : 'signIn')}>
            <Text style={[styles.switchLink, { color: palette.accent }]}>
              {mode === 'signIn' ? 'Sign up' : 'Sign in'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
