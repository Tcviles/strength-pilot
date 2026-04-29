import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '../../hooks/useAppState';
import { useAuth } from '../../hooks/useAuth';
import { resolveActiveTab, resolveAppStage } from './appShell';

export function useAppShellState() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
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
    workoutStartedAt,
    isGuestMode,
    status,
    error,
    loading,
  } = useAppState();

  const showStartupLoader =
    authHydrating ||
    hydratingSession ||
    (Boolean(tokens?.idToken) && bootstrapping && !needsOnboarding && (!profile || !gym));

  const currentStage = resolveAppStage({
    needsOnboarding,
    currentScreen,
    hasTokens: Boolean(tokens),
    hasWorkout: Boolean(workout),
    hasWorkoutStarted: Boolean(workoutStartedAt),
    isGuestMode,
  });

  const displayLoading = !tokens ? authLoading : loading;
  const displayStatus = !tokens ? authStatus : status;
  const displayError = !tokens ? authError : error;
  const isAuthStage = currentStage === 'auth';
  const isOnboardingStage = currentStage === 'onboarding';
  const isTabletLike = width >= 700;
  const hasStickyFooter = !isAuthStage && !isOnboardingStage;
  const hasProfileFooter = currentStage === 'auth';
  const shouldShowFooter = hasStickyFooter || hasProfileFooter;
  const hasStickyWorkoutBar = currentStage === 'workout' && Boolean(workout) && Boolean(workoutStartedAt);
  const activeTab = resolveActiveTab(currentStage);
  const authStageWidth = isTabletLike ? Math.min(width - 72, 860) : undefined;
  const authViewportMinHeight = Math.max(0, height - insets.top);
  const authLogoWidth = isTabletLike ? 360 : 252;
  const authLogoHeight = isTabletLike ? 220 : 156;
  const authTextLogoWidth = isTabletLike ? 320 : 224;
  const authTextLogoHeight = isTabletLike ? 62 : 44;
  const authTaglineFontSize = isTabletLike ? 22 : 14;

  return {
    insets,
    workout,
    workoutStartedAt,
    isGuestMode,
    showStartupLoader,
    currentStage,
    displayLoading,
    displayStatus,
    displayError,
    isAuthStage,
    isOnboardingStage,
    shouldShowFooter,
    hasStickyWorkoutBar,
    activeTab,
    authStageWidth,
    authViewportMinHeight,
    authLogoWidth,
    authLogoHeight,
    authTextLogoWidth,
    authTextLogoHeight,
    authTaglineFontSize,
  };
}
