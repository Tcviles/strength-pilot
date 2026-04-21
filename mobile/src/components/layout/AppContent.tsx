import React from 'react';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StatusBar, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { appContentStyles } from './AppContent.styles';
import { useAppState } from '../../hooks/useAppState';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../auth/AuthCard';
import { FooterNav } from '../navigation/FooterNav';
import { HomeCard } from '../home/HomeCard';
import { OnboardingCard } from '../onboarding/OnboardingCard';
import { WorkoutCard } from '../workout/WorkoutCard';

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
    status,
    error,
    loading,
    backHome,
    openWorkout,
  } = useAppState();

  const shouldStayOnAuthStage = !tokens || bootstrapping || (!needsOnboarding && (!profile || !gym));
  const currentStage = shouldStayOnAuthStage
    ? 'auth'
    : needsOnboarding
      ? 'onboarding'
      : currentScreen === 'workout' && workout
        ? 'workout'
        : 'home';

  const displayLoading = !tokens ? authLoading : loading;
  const displayStatus = !tokens ? authStatus : status;
  const displayError = !tokens ? authError : error;
  const isAuthStage = currentStage === 'auth';
  const isOnboardingStage = currentStage === 'onboarding';
  const isTabletLike = width >= 700;
  const hasStickyFooter = !isAuthStage && !isOnboardingStage;
  const activeTab = currentStage === 'workout' ? 'workout' : 'home';
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
  const showStartupLoader = authHydrating || hydratingSession;

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
      <ScrollView
        contentContainerStyle={[
          appContentStyles.scrollContent,
          isAuthStage
            ? [appContentStyles.authScrollContent, { minHeight: authViewportMinHeight }]
            : null,
          isOnboardingStage ? appContentStyles.onboardingScrollContent : null,
          hasStickyFooter
            ? { paddingBottom: 110 + Math.max(insets.bottom, 12) }
            : null,
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
          ) : !isOnboardingStage && currentStage !== 'home' ? (
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

          {(displayError || (!isAuthStage && !isOnboardingStage && displayStatus !== 'Ready' && displayStatus !== 'Signed in and synced.')) && !isOnboardingStage ? (
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

          {currentStage === 'workout' && workout ? <WorkoutCard /> : null}

          {displayLoading ? (
            <View style={appContentStyles.loadingRow}>
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : null}
      </ScrollView>
      {hasStickyFooter ? (
        <View style={appContentStyles.footerDock}>
          <FooterNav
            activeTab={activeTab}
            onSelect={(tab) => {
              if (tab === 'home') {
                backHome();
              } else if (tab === 'workout') {
                openWorkout();
              }
            }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
