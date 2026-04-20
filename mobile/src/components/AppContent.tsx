import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, View, useColorScheme } from 'react-native';

import { darkPalette, lightPalette } from '../theme/palette';
import { styles } from '../theme/styles';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { AuthCard } from './AuthCard';
import { HomeCard } from './HomeCard';
import { OnboardingCard } from './OnboardingCard';
import { WorkoutCard } from './WorkoutCard';

export function AppContent() {
  const isDarkMode = useColorScheme() !== 'light';
  const palette = isDarkMode ? darkPalette : lightPalette;
  const {
    mode,
    email,
    password,
    newPassword,
    requiresNewPassword,
    tokens,
    loading: authLoading,
    status: authStatus,
    error: authError,
    setMode,
    setEmail,
    setPassword,
    setNewPassword,
    signIn,
    completeNewPassword,
    signUp,
  } = useAuth();
  const {
    profile,
    gym,
    workout,
    focus,
    draftProfile,
    draftGym,
    crowd,
    mood,
    status,
    error,
    loading,
    setDraftProfile,
    setDraftGym,
    setCrowd,
    setMood,
    saveOnboarding,
    generateWorkout,
    backHome,
  } = useAppState();

  const currentStage = !tokens
    ? 'auth'
    : !profile || !gym
      ? 'onboarding'
      : workout
        ? 'workout'
        : 'home';

  const equipmentCount = Object.values((gym || draftGym).equipment).filter(Boolean).length;
  const displayLoading = currentStage === 'auth' ? authLoading : loading;
  const displayStatus = currentStage === 'auth' ? authStatus : status;
  const displayError = currentStage === 'auth' ? authError : error;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.page }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: palette.page }}>
        <View style={[styles.shell, { backgroundColor: palette.panel, borderColor: palette.line }]}>
          <View style={styles.hero}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { borderColor: palette.accentSoft, backgroundColor: palette.badge }]}>
                <Text style={[styles.badgeText, { color: palette.accent }]}>SP</Text>
              </View>
              <View style={styles.heroCopy}>
                <Text style={[styles.wordmark, { color: palette.text }]}>StrengthPilot</Text>
                <Text style={[styles.tagline, { color: palette.muted }]}>
                  All the tools to stay on course.
                </Text>
              </View>
            </View>
            <View style={[styles.missionStrip, { borderColor: palette.line, backgroundColor: palette.card }]}>
              <Text style={[styles.missionLabel, { color: palette.accent }]}>Operating Principle</Text>
              <Text style={[styles.missionText, { color: palette.text }]}>
                We are what we repeatedly do.
              </Text>
            </View>
          </View>

          <View style={[styles.statusCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <Text style={[styles.statusText, { color: palette.text }]}>{displayStatus}</Text>
            {displayError ? <Text style={[styles.errorText, { color: palette.error }]}>{displayError}</Text> : null}
          </View>

          {currentStage === 'auth' ? (
            <AuthCard
              palette={palette}
              email={email}
              password={password}
              newPassword={newPassword}
              requiresNewPassword={requiresNewPassword}
              loading={loading}
              mode={mode}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onNewPasswordChange={setNewPassword}
              onModeChange={setMode}
              onSignIn={() => signIn().catch(() => undefined)}
              onCompleteNewPassword={() => completeNewPassword().catch(() => undefined)}
              onSignUp={() => signUp().catch(() => undefined)}
            />
          ) : null}

          {currentStage === 'onboarding' ? (
            <OnboardingCard
              palette={palette}
              profile={draftProfile}
              gym={draftGym}
              loading={displayLoading}
              onProfileChange={setDraftProfile}
              onGymChange={setDraftGym}
              onSave={saveOnboarding}
            />
          ) : null}

          {currentStage === 'home' ? (
            <HomeCard
              palette={palette}
              profile={profile || draftProfile}
              gym={gym || draftGym}
              crowd={crowd}
              mood={mood}
              equipmentCount={equipmentCount}
              loading={displayLoading}
              onCrowdChange={setCrowd}
              onMoodChange={setMood}
              onGenerate={generateWorkout}
            />
          ) : null}

          {currentStage === 'workout' && workout ? (
            <WorkoutCard palette={palette} workout={workout} focus={focus} onBack={backHome} />
          ) : null}

          {displayLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
