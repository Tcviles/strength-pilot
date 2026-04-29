import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { HomeCard } from '../home/HomeCard';
import { LibraryCard } from '../library/LibraryCard';
import { OnboardingCard } from '../onboarding/OnboardingCard';
import { ProfileCard } from '../profile/ProfileCard';
import { FeaturePlaceholderCard } from '../shared/FeaturePlaceholderCard';
import { AuthCard } from '../auth/AuthCard';
import { WorkoutCard } from '../workout/WorkoutCard';
import { WorkoutPreviewCard } from '../workout/WorkoutPreviewCard';
import { useAppShellState } from './useAppShellState';

export function AppRouter() {
  const { palette } = useTheme();
  const {
    currentStage,
    workout,
    isGuestMode,
    displayLoading,
    displayStatus,
    displayError,
    authStageWidth,
    authLogoWidth,
    authLogoHeight,
    authTextLogoWidth,
    authTextLogoHeight,
    authTaglineFontSize,
  } = useAppShellState();
  const isAuthStage = currentStage === 'auth';
  const isOnboardingStage = currentStage === 'onboarding';
  const authStatusBannerTextColor = displayError ? '#fff' : palette.text;

  return (
    <>
      {isAuthStage ? (
        <View style={[appRouterStyles.authStageWrap, authStageWidth ? { width: authStageWidth } : null]}>
          <View style={appRouterStyles.authHero}>
            <Image
              source={require('../../media/LoginLogo.png')}
              style={[appRouterStyles.authLogo, { width: authLogoWidth, height: authLogoHeight }]}
              resizeMode="contain"
            />
            <Image
              source={require('../../media/TextLogo.png')}
              style={[appRouterStyles.authTextLogo, { width: authTextLogoWidth, height: authTextLogoHeight }]}
              resizeMode="contain"
            />
            <Text style={[appRouterStyles.authTagline, { color: palette.muted, fontSize: authTaglineFontSize }]}>
              All the tools to stay on course.
            </Text>
          </View>
          {(displayError || displayStatus !== 'Ready') ? (
            <View
              style={[
                appRouterStyles.authStatusBanner,
                {
                  backgroundColor: displayError ? palette.error : palette.panel,
                  borderColor: displayError ? palette.error : palette.line,
                },
              ]}
            >
              <Text
                style={[
                  appRouterStyles.authStatusBannerText,
                  { color: authStatusBannerTextColor },
                ]}
              >
                {displayError || displayStatus}
              </Text>
            </View>
          ) : null}
          <AuthCard />
        </View>
      ) : null}

      {(displayError
        || (!isAuthStage
          && !isOnboardingStage
          && displayStatus !== 'Ready'
          && displayStatus !== 'Signed in and synced.'))
        && !isOnboardingStage
        && !isAuthStage
        && currentStage !== 'workout' ? (
          <View
            style={[
            appRouterStyles.statusCard,
              { backgroundColor: palette.card, borderColor: palette.line },
            ]}
          >
            <Text style={[appRouterStyles.statusText, { color: palette.text }]}>{displayStatus}</Text>
            {displayError ? <Text style={[appRouterStyles.errorText, { color: palette.error }]}>{displayError}</Text> : null}
          </View>
        ) : null}

      {isOnboardingStage ? <OnboardingCard /> : null}
      {currentStage === 'home' ? <HomeCard mode="signedIn" /> : null}
      {currentStage === 'guest-home' ? <HomeCard mode="guest" /> : null}
      {currentStage === 'workout' && workout ? <WorkoutCard /> : null}
      {currentStage === 'workout-preview' && workout ? <WorkoutPreviewCard /> : null}
      {currentStage === 'profile' ? <ProfileCard /> : null}
      {currentStage === 'progress' ? (
        <FeaturePlaceholderCard
          eyebrow={isGuestMode ? 'HISTORY' : 'PROGRESS'}
          title={isGuestMode ? 'Guest workout history is coming next.' : 'Progress tracking is on deck.'}
          body={isGuestMode
            ? 'This is where your recently run guest workouts and quick replays will live.'
            : 'We’ll stack streaks, weekly volume, and body-part progress here once the workout flow is locked in.'}
        />
      ) : null}
      {currentStage === 'library' ? <LibraryCard /> : null}

      {displayLoading ? (
        <View style={appRouterStyles.loadingRow}>
          <ActivityIndicator color={palette.accent} />
        </View>
      ) : null}
    </>
  );
}

const appRouterStyles = StyleSheet.create({
  authStageWrap: {
    width: '100%',
    alignSelf: 'center',
  },
  authHero: {
    alignItems: 'center',
    paddingTop: 0,
    gap: 0,
    marginBottom: 14,
  },
  authLogo: {
    width: 252,
    height: 156,
  },
  authTextLogo: {
    width: 224,
    height: 44,
    marginTop: -12,
    marginBottom: 0,
  },
  authTagline: {
    fontSize: 14,
  },
  authStatusBanner: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  authStatusBannerText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  loadingRow: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});
