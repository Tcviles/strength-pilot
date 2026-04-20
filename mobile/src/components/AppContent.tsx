import React from 'react';
import { ActivityIndicator, Image, ImageBackground, SafeAreaView, ScrollView, StatusBar, Text, View, useColorScheme } from 'react-native';

import { darkPalette, lightPalette } from '../theme/palette';
import { appContentStyles } from './AppContent.styles';
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
  const isAuthStage = currentStage === 'auth';
  const isOnboardingStage = currentStage === 'onboarding';
  const backgroundImageStyle = isAuthStage
    ? appContentStyles.authBackgroundImage
    : isOnboardingStage
      ? appContentStyles.onboardingBackgroundImage
      : appContentStyles.appBackgroundImage;
  const backgroundOverlayStyle = isAuthStage
    ? appContentStyles.authBackgroundOverlay
    : isOnboardingStage
      ? appContentStyles.onboardingBackgroundOverlay
      : appContentStyles.appBackgroundOverlay;

  return (
    <SafeAreaView style={[appContentStyles.safeArea, { backgroundColor: palette.page }]}>
      <StatusBar barStyle="light-content" />
      <View pointerEvents="none" style={appContentStyles.backgroundWrap}>
        <ImageBackground
          source={require('../media/AppBackground.png')}
          style={appContentStyles.backgroundWrap}
          imageStyle={backgroundImageStyle}
          resizeMode="cover"
        >
          <View
            style={[
              backgroundOverlayStyle,
              { backgroundColor: palette.page },
            ]}
          />
        </ImageBackground>
      </View>
      <ScrollView
        contentContainerStyle={[
          appContentStyles.scrollContent,
          isAuthStage ? appContentStyles.authScrollContent : null,
          isOnboardingStage ? appContentStyles.onboardingScrollContent : null,
        ]}
        style={appContentStyles.stageScroll}
      >
        <View
          style={[
            appContentStyles.shell,
            isAuthStage ? appContentStyles.authShell : null,
            isOnboardingStage ? appContentStyles.onboardingShell : null,
            isAuthStage || isOnboardingStage
              ? appContentStyles.authShellTransparent
              : { backgroundColor: palette.panel, borderColor: palette.line },
          ]}
        >
          {isAuthStage ? (
            <View style={appContentStyles.authHero}>
              <Image source={require('../media/LoginLogo.png')} style={appContentStyles.authLogo} resizeMode="contain" />
              <Text style={[appContentStyles.authWordmark, { color: palette.text }]}>StrengthPilot</Text>
              <Text style={[appContentStyles.authTagline, { color: palette.muted }]}>
                All the tools to stay on course.
              </Text>
            </View>
          ) : !isOnboardingStage ? (
            <View style={appContentStyles.hero}>
              <View style={appContentStyles.badgeRow}>
                <View style={[appContentStyles.badge, { borderColor: palette.accentSoft, backgroundColor: palette.badge }]}>
                  <Text style={[appContentStyles.badgeText, { color: palette.accent }]}>SP</Text>
                </View>
                <View style={appContentStyles.heroCopy}>
                  <Text style={[appContentStyles.wordmark, { color: palette.text }]}>StrengthPilot</Text>
                  <Text style={[appContentStyles.tagline, { color: palette.muted }]}>
                    All the tools to stay on course.
                  </Text>
                </View>
              </View>
              <View style={[appContentStyles.missionStrip, { borderColor: palette.line, backgroundColor: palette.card }]}>
                <Text style={[appContentStyles.missionLabel, { color: palette.accent }]}>Operating Principle</Text>
                <Text style={[appContentStyles.missionText, { color: palette.text }]}>
                  We are what we repeatedly do.
                </Text>
              </View>
            </View>
          ) : null}

          {(displayError || (!isAuthStage && !isOnboardingStage && displayStatus !== 'Ready') || (isAuthStage && displayStatus !== 'Ready' && displayStatus !== 'Signed in.')) && !isOnboardingStage ? (
            <View
              style={[
                appContentStyles.statusCard,
                isAuthStage ? appContentStyles.authStatusCard : null,
                { backgroundColor: palette.card, borderColor: palette.line },
              ]}
            >
              <Text style={[appContentStyles.statusText, { color: palette.text }]}>{displayStatus}</Text>
              {displayError ? <Text style={[appContentStyles.errorText, { color: palette.error }]}>{displayError}</Text> : null}
            </View>
          ) : null}

          {isAuthStage ? (
            <AuthCard
              palette={palette}
              email={email}
              password={password}
              newPassword={newPassword}
              requiresNewPassword={requiresNewPassword}
              loading={authLoading}
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

          {isOnboardingStage ? (
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
            <View style={appContentStyles.loadingRow}>
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
