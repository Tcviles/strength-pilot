export type AppStage =
  | 'auth'
  | 'onboarding'
  | 'home'
  | 'guest-home'
  | 'workout'
  | 'workout-preview'
  | 'profile'
  | 'progress'
  | 'library';

export type AppTab = 'home' | 'workout' | 'progress' | 'library' | 'profile';

type ResolveAppStageArgs = {
  needsOnboarding: boolean;
  currentScreen: 'home' | 'workout' | 'progress' | 'library' | 'profile';
  hasTokens: boolean;
  hasWorkout: boolean;
  hasWorkoutStarted: boolean;
  isGuestMode: boolean;
};

export function resolveAppStage({
  needsOnboarding,
  currentScreen,
  hasTokens,
  hasWorkout,
  hasWorkoutStarted,
  isGuestMode,
}: ResolveAppStageArgs): AppStage {
  if (needsOnboarding) {
    return 'onboarding';
  }

  if (currentScreen === 'profile') {
    return hasTokens ? 'profile' : 'auth';
  }

  if (currentScreen === 'workout' && hasWorkout) {
    return hasWorkoutStarted ? 'workout' : 'workout-preview';
  }

  if (currentScreen === 'progress') {
    return 'progress';
  }

  if (currentScreen === 'library') {
    return 'library';
  }

  return isGuestMode ? 'guest-home' : 'home';
}

export function resolveActiveTab(stage: AppStage): AppTab {
  if (stage === 'workout') {
    return 'workout';
  }

  if (stage === 'profile' || stage === 'auth') {
    return 'profile';
  }

  if (stage === 'progress') {
    return 'progress';
  }

  if (stage === 'library') {
    return 'library';
  }

  return 'home';
}
