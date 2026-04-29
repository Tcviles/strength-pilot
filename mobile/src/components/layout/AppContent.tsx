import React from 'react';
import { ImageBackground, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { useAppState } from '../../hooks/useAppState';
import { FooterNav } from '../navigation/FooterNav';
import { WorkoutTopBar } from '../workout/WorkoutTopBar';
import { AppRouter } from './AppRouter';
import { AppStartupLoader } from './AppStartupLoader';
import { useAppShellState } from './useAppShellState';

export function AppContent() {
  const { palette } = useTheme();
  const { backHome, navigateToScreen, openWorkout } = useAppState();
  const {
    insets,
    showStartupLoader,
    isAuthStage,
    isOnboardingStage,
    shouldShowFooter,
    hasStickyWorkoutBar,
    activeTab,
    authViewportMinHeight,
  } = useAppShellState();
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
    return <AppStartupLoader />;
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
          style={appContentStyles.backgroundImageFill}
          imageStyle={[appContentStyles.backgroundImageCover, backgroundImageStyle]}
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
        overScrollMode="never"
        persistentScrollbar={false}
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
        <AppRouter />
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

const appContentStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  stageScroll: {
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  authScrollContent: {
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 10,
  },
  workoutScrollContent: {
    paddingTop: 4,
    paddingHorizontal: 5,
  },
  onboardingScrollContent: {
    justifyContent: 'center',
    minHeight: '100%',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  backgroundWrap: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  backgroundImageFill: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  backgroundImageCover: {
    width: '100%',
    height: '100%',
  },
  authBackgroundImage: {
    opacity: 0.88,
    transform: [{ scale: 1.18 }],
  },
  authBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.38,
  },
  onboardingBackgroundImage: {
    opacity: 0.84,
    transform: [{ scale: 1.24 }, { translateX: 40 }, { translateY: -36 }],
  },
  onboardingBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  appBackgroundImage: {
    opacity: 0.62,
    transform: [{ scale: 1.22 }, { translateY: 52 }],
  },
  appBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.68,
  },
  footerDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
