import React from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StatusBar, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { appContentStyles } from './AppContent.styles';
import { useAppState } from '../../hooks/useAppState';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../auth/AuthCard';
import { GuestHomeCard } from '../home/GuestHomeCard';
import { FooterNav } from '../navigation/FooterNav';
import { HomeCard } from '../home/HomeCard';
import { LibraryCard } from '../library/LibraryCard';
import { OnboardingCard } from '../onboarding/OnboardingCard';
import { ProfileCard } from '../profile/ProfileCard';
import { FeaturePlaceholderCard } from '../shared/FeaturePlaceholderCard';
import { WorkoutCard } from '../workout/WorkoutCard';
import { WorkoutTopBar } from '../workout/WorkoutTopBar';

export function AppContent() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { palette } = useTheme();
  const {
    tokens,
    hydrating: authHydrating,
    status: authStatus,
    error: authError,
    loading: authLoading,
  } = useAuth();
  const {
    workout,
    bootstrapping,
    hydratingSession,
    needsOnboarding,
    profile,
    gym,
    currentScreen,
    isGuestMode,
    status,
    error,
    loading,
    backHome,
    navigateToScreen,
    openWorkout,
  } = useAppState();

  const showStartupLoader =
    authHydrating ||
    hydratingSession ||
    (Boolean(tokens?.idToken) && bootstrapping && !needsOnboarding && (!profile || !gym));

  const currentStage = needsOnboarding
    ? 'onboarding'
    : currentScreen === 'profile'
      ? (tokens ? 'profile' : 'auth')
      : currentScreen === 'workout' && workout
        ? 'workout'
        : currentScreen === 'progress'
          ? 'progress'
          : currentScreen === 'library'
            ? 'library'
            : isGuestMode
              ? 'guest-home'
              : 'home';

  const displayLoading = !tokens ? authLoading : loading;
  const displayStatus = !tokens ? authStatus : status;
  const displayError = !tokens ? authError : error;
  const isAuthStage = currentStage === 'auth';
  const isOnboardingStage = currentStage === 'onboarding';
  const isTabletLike = width >= 700;
  const hasStickyFooter = !isAuthStage && !isOnboardingStage;
  const hasProfileFooter = currentStage === 'auth';
  const shouldShowFooter = hasStickyFooter || hasProfileFooter;
  const hasStickyWorkoutBar = currentStage === 'workout' && Boolean(workout);
  const activeTab = currentStage === 'workout'
    ? 'workout'
    : currentStage === 'profile' || currentStage === 'auth'
      ? 'profile'
      : currentStage === 'progress'
        ? 'progress'
        : currentStage === 'library'
          ? 'library'
          : 'home';
  const authStageWidth = isTabletLike ? Math.min(width - 72, 860) : undefined;
  const authViewportMinHeight = Math.max(0, height - insets.top);
  const authLogoWidth = isTabletLike ? 360 : 252;
  const authLogoHeight = isTabletLike ? 220 : 156;
  const authTextLogoWidth = isTabletLike ? 320 : 224;
  const authTextLogoHeight = isTabletLike ? 62 : 44;
  const authTaglineFontSize = isTabletLike ? 22 : 14;
  const authStatusBannerTextColor = displayError ? '#fff' : palette.text;
  const authStatusBannerTextStyle = { color: authStatusBannerTextColor };
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

  if (showStartupLoader) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[appContentStyles.safeArea, { backgroundColor: palette.page }]}
      >
        <StatusBar barStyle="light-content" />
        <View pointerEvents="none" style={appContentStyles.backgroundWrap}>
          <ImageBackground
            source={require('../../media/AppBackground.png')}
            style={appContentStyles.backgroundWrap}
            imageStyle={appContentStyles.authBackgroundImage}
            resizeMode="cover"
          >
            <View
              style={[
                appContentStyles.authBackgroundOverlay,
                { backgroundColor: palette.page },
              ]}
            />
          </ImageBackground>
        </View>
        <View style={appContentStyles.startupLoaderWrap}>
          <View style={[appContentStyles.startupLoaderCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <Image
              source={require('../../media/LoginLogo.png')}
              style={appContentStyles.startupLoaderLogo}
              resizeMode="contain"
            />
            <ActivityIndicator color={palette.accent} size="large" />
            <Text style={[appContentStyles.startupLoaderText, { color: palette.text }]}>
              Restoring your session...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[appContentStyles.safeArea, { backgroundColor: palette.page }]}
    >
      <StatusBar barStyle="light-content" />
      <View pointerEvents="none" style={appContentStyles.backgroundWrap}>
        <ImageBackground
          source={require('../../media/AppBackground.png')}
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
      {hasStickyWorkoutBar ? <WorkoutTopBar /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          appContentStyles.scrollContent,
          isAuthStage
            ? [appContentStyles.authScrollContent, { minHeight: authViewportMinHeight }]
            : null,
          isOnboardingStage ? appContentStyles.onboardingScrollContent : null,
          shouldShowFooter
            ? { paddingBottom: 110 + Math.max(insets.bottom, 12) }
            : null,
          hasStickyWorkoutBar ? appContentStyles.workoutScrollContent : null,
        ]}
        style={appContentStyles.stageScroll}
      >
          {isAuthStage ? (
            <View style={[appContentStyles.authStageWrap, authStageWidth ? { width: authStageWidth } : null]}>
              <View style={appContentStyles.authHero}>
                <Image
                  source={require('../../media/LoginLogo.png')}
                  style={[appContentStyles.authLogo, { width: authLogoWidth, height: authLogoHeight }]}
                  resizeMode="contain"
                />
                <Image
                  source={require('../../media/TextLogo.png')}
                  style={[appContentStyles.authTextLogo, { width: authTextLogoWidth, height: authTextLogoHeight }]}
                  resizeMode="contain"
                />
                <Text style={[appContentStyles.authTagline, { color: palette.muted, fontSize: authTaglineFontSize }]}>
                  All the tools to stay on course.
                </Text>
              </View>
              {(displayError || displayStatus !== 'Ready') ? (
                <View
                  style={[
                    appContentStyles.authStatusBanner,
                    {
                      backgroundColor: displayError ? palette.error : palette.panel,
                      borderColor: displayError ? palette.error : palette.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      appContentStyles.authStatusBannerText,
                      authStatusBannerTextStyle,
                    ]}
                  >
                    {displayError || displayStatus}
                  </Text>
                </View>
              ) : null}
              <AuthCard />
            </View>
          ) : null}

          {(displayError || (!isAuthStage && !isOnboardingStage && displayStatus !== 'Ready' && displayStatus !== 'Signed in and synced.')) && !isOnboardingStage && !isAuthStage && currentStage !== 'workout' ? (
            <View
              style={[
                appContentStyles.statusCard,
                { backgroundColor: palette.card, borderColor: palette.line },
              ]}
            >
              <Text style={[appContentStyles.statusText, { color: palette.text }]}>{displayStatus}</Text>
              {displayError ? <Text style={[appContentStyles.errorText, { color: palette.error }]}>{displayError}</Text> : null}
            </View>
          ) : null}

          {isOnboardingStage ? <OnboardingCard /> : null}

          {currentStage === 'home' ? <HomeCard /> : null}

          {currentStage === 'guest-home' ? <GuestHomeCard /> : null}

          {currentStage === 'workout' && workout ? <WorkoutCard /> : null}

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
            <View style={appContentStyles.loadingRow}>
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : null}
      </ScrollView>
      {shouldShowFooter ? (
        <View style={appContentStyles.footerDock}>
          <FooterNav
            activeTab={activeTab}
            onSelect={(tab) => {
              if (tab === 'home') {
                backHome();
              } else if (tab === 'workout') {
                openWorkout();
              } else {
                navigateToScreen(tab);
              }
            }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
