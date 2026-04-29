import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { CONFIG } from '../config/appConfig';
import { getSuggestedWeight, isCompoundExercise } from '../constants/exercises';
import { buildGymFromType, DEFAULT_GYM, DEFAULT_PROFILE } from '../constants/defaults';
import { apiRequest, publicApiRequest } from '../services/api';
import { getStoredObject, setStoredObject, STORAGE_KEYS } from '../services/storage';
import type { Crowd, Gym, Profile, Workout, WorkoutExerciseProgress, WorkoutSetProgress } from '../types/app';
import { useAuth } from '../hooks/useAuth';
import { humanize } from '../utils/format';

type AppScreen = 'home' | 'workout' | 'progress' | 'library' | 'profile';

type PersistedWorkoutSession = {
  workout: Workout | null;
  focus: string;
  currentScreen: AppScreen;
  workoutStartedAt: string | null;
  activeExerciseIndex: number;
  restStartedAt: string | null;
  workoutProgress: WorkoutExerciseProgress[];
  pendingFeedback: { exerciseIndex: number; setIndex: number } | null;
  crowd: Crowd;
  mood: string;
};

type PersistedGuestPreferences = {
  draftProfile: Profile;
  draftGym: Gym;
  crowd: Crowd;
  mood: string;
};

type AppContextValue = {
  profile: Profile | null;
  gym: Gym | null;
  workout: Workout | null;
  focus: string;
  bootstrapping: boolean;
  hydratingSession: boolean;
  needsOnboarding: boolean;
  currentScreen: AppScreen;
  workoutStartedAt: string | null;
  activeExerciseIndex: number;
  restStartedAt: string | null;
  workoutProgress: WorkoutExerciseProgress[];
  pendingFeedback: { exerciseIndex: number; setIndex: number } | null;
  isGuestMode: boolean;
  draftProfile: Profile;
  draftGym: Gym;
  crowd: Crowd;
  mood: string;
  status: string;
  error: string;
  loading: boolean;
  setDraftProfile: (value: Profile) => void;
  setDraftGym: (value: Gym) => void;
  setCrowd: (value: Crowd) => void;
  setMood: (value: string) => void;
  saveOnboarding: () => Promise<void>;
  generateWorkout: (options?: { openWorkout?: boolean; startOnComplete?: boolean; focus?: string }) => Promise<void>;
  generateGuestWorkout: (category: string) => Promise<void>;
  createCustomWorkout: () => void;
  startWorkout: () => Promise<void>;
  openWorkout: () => void;
  backHome: () => void;
  navigateToScreen: (screen: AppScreen) => void;
  moveWorkoutExercise: (exerciseIndex: number, direction: 'up' | 'down') => void;
  updateWorkoutExerciseTargetSets: (exerciseIndex: number, targetSets: number) => void;
  removeWorkoutExercise: (exerciseIndex: number) => void;
  insertWorkoutExercise: (insertIndex: number, exerciseId: string) => void;
  removeWorkoutSet: (exerciseIndex: number, setIndex: number) => void;
  setActiveExerciseIndex: (index: number) => void;
  updateWorkoutSetField: (exerciseIndex: number, setIndex: number, field: 'actualWeight' | 'actualReps', value: string) => void;
  completeWorkoutSet: (exerciseIndex: number, setIndex: number) => void;
  addWorkoutSet: (exerciseIndex: number) => void;
  respondToWorkoutFeedback: (score: number | null) => void;
  swapWorkoutExercise: (exerciseIndex: number, exerciseId: string) => void;
  saveWorkout: () => void;
  cancelWorkout: () => void;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

function parseSuggestedReps(targetReps: string) {
  const parts = targetReps
    .split('-')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value));

  if (parts.length === 0) {
    return 8;
  }

  return parts[parts.length - 1];
}

function buildExerciseProgress(exercise: Workout['exercises'][number], experience: Profile['experience']) {
  const suggestedWeight = getSuggestedWeight(exercise.exerciseId, experience);
  const suggestedReps = parseSuggestedReps(exercise.targetReps);
  const existingSetProgress = exercise.sets.map<WorkoutSetProgress>((loggedSet) => ({
    setNumber: loggedSet.setNumber,
    suggestedWeight,
    suggestedReps,
    actualWeight: String(loggedSet.weight),
    actualReps: String(loggedSet.reps),
    completed: true,
    completedAt: loggedSet.completedAt,
    feedbackScore: typeof loggedSet.rir === 'number' ? loggedSet.rir : undefined,
  }));

  const pendingSetProgress = Array.from({ length: Math.max(exercise.targetSets - existingSetProgress.length, 0) }, (_, index) => {
    const setNumber = existingSetProgress.length + index + 1;

    return {
      setNumber,
      suggestedWeight,
      suggestedReps,
      actualWeight: suggestedWeight ? String(suggestedWeight) : '',
      actualReps: String(suggestedReps),
      completed: false,
    };
  });

  return {
    exerciseId: exercise.exerciseId,
    setProgress: [...existingSetProgress, ...pendingSetProgress],
  };
}

function buildWorkoutProgress(workout: Workout, experience: Profile['experience']) {
  return workout.exercises.map((exercise) => buildExerciseProgress(exercise, experience));
}

function buildInsertedExercise(exerciseId: string) {
  const moderateReps = isCompoundExercise(exerciseId) ? '6-8' : '10-12';
  const restSeconds = isCompoundExercise(exerciseId) ? 90 : 60;

  return {
    exerciseId,
    targetSets: 3,
    targetReps: moderateReps,
    restSeconds,
    sets: [],
  };
}

function buildCustomWorkout(profile: Profile): { workout: Workout; focus: string } {
  return {
    focus: 'Custom Workout',
    workout: {
      workoutId: `custom-${Date.now()}`,
      goal: profile.goal || 'general',
      durationMinutes: profile.sessionLength || 60,
      exercises: [],
    },
  };
}

function adaptNextSetSuggestion(
  currentSet: WorkoutSetProgress,
  nextSet: WorkoutSetProgress,
) {
  const actualWeight = Number.parseFloat(currentSet.actualWeight || '0');
  const actualReps = Number.parseInt(currentSet.actualReps || '0', 10);
  const suggestedWeight = currentSet.suggestedWeight;
  const suggestedReps = currentSet.suggestedReps;

  if (!Number.isFinite(actualReps) || actualReps <= 0) {
    return nextSet;
  }

  let nextSuggestedWeight = actualWeight > 0 ? actualWeight : nextSet.suggestedWeight;
  let nextSuggestedReps = actualReps;

  if (actualWeight >= suggestedWeight && actualReps >= suggestedReps + 2) {
    nextSuggestedWeight = actualWeight + 5;
    nextSuggestedReps = Math.max(suggestedReps, actualReps - 1);
  } else if (actualWeight >= suggestedWeight && actualReps >= suggestedReps) {
    nextSuggestedWeight = actualWeight;
    nextSuggestedReps = actualReps;
  } else if (actualReps <= Math.max(1, suggestedReps - 2)) {
    nextSuggestedWeight = actualWeight > 10 ? actualWeight - 5 : actualWeight;
    nextSuggestedReps = Math.max(actualReps + 1, suggestedReps - 1);
  }

  return {
    ...nextSet,
    suggestedWeight: Math.max(0, nextSuggestedWeight),
    suggestedReps: Math.max(1, nextSuggestedReps),
    actualWeight: nextSet.completed ? nextSet.actualWeight : String(Math.max(0, nextSuggestedWeight)),
    actualReps: nextSet.completed ? nextSet.actualReps : String(Math.max(1, nextSuggestedReps)),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { tokens, hydrating: authHydrating } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [focus, setFocus] = useState('');
  const [bootstrapping, setBootstrapping] = useState(false);
  const [hydratingSession, setHydratingSession] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [workoutStartedAt, setWorkoutStartedAt] = useState<string | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [restStartedAt, setRestStartedAt] = useState<string | null>(null);
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutExerciseProgress[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<{ exerciseIndex: number; setIndex: number } | null>(null);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftProfile, setDraftProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draftGym, setDraftGym] = useState<Gym>(DEFAULT_GYM);
  const [crowd, setCrowd] = useState<Crowd>('medium');
  const [mood, setMood] = useState('Ready');
  const isGuestMode = !tokens?.idToken;

  useEffect(() => {
    if (authHydrating) {
      return;
    }

    let cancelled = false;

    const hydrateStoredSession = async () => {
      const storedSession = await getStoredObject<PersistedWorkoutSession>(STORAGE_KEYS.workoutSession);
      if (!cancelled && storedSession) {
        setWorkout(storedSession.workout);
        setFocus(storedSession.focus);
        setCurrentScreen(storedSession.currentScreen);
        setWorkoutStartedAt(storedSession.workoutStartedAt);
        setActiveExerciseIndex(storedSession.activeExerciseIndex || 0);
        setRestStartedAt(storedSession.restStartedAt);
        setWorkoutProgress(storedSession.workoutProgress || []);
        setPendingFeedback(storedSession.pendingFeedback || null);
        setCrowd(storedSession.crowd);
        setMood(storedSession.mood);
      }
      if (!cancelled) {
        setHydratingSession(false);
      }
    };

    hydrateStoredSession().catch(() => {
      if (!cancelled) {
        setHydratingSession(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authHydrating]);

  useEffect(() => {
    if (authHydrating || tokens?.idToken) {
      return;
    }

    let cancelled = false;

    const hydrateGuestPreferences = async () => {
      const storedPreferences = await getStoredObject<PersistedGuestPreferences>(STORAGE_KEYS.guestPreferences);
      if (!cancelled && storedPreferences) {
        setDraftProfile({
          ...DEFAULT_PROFILE,
          ...storedPreferences.draftProfile,
          activeGymId: storedPreferences.draftProfile.activeGymId || CONFIG.gymId,
        });
        setDraftGym({
          ...DEFAULT_GYM,
          ...storedPreferences.draftGym,
          equipment: { ...DEFAULT_GYM.equipment, ...(storedPreferences.draftGym.equipment || {}) },
        });
        setCrowd(storedPreferences.crowd || 'medium');
        setMood(storedPreferences.mood || 'Ready');
      }
    };

    hydrateGuestPreferences().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [authHydrating, tokens?.idToken]);

  useEffect(() => {
    if (authHydrating || tokens?.idToken) {
      return;
    }

    setStoredObject<PersistedGuestPreferences>(STORAGE_KEYS.guestPreferences, {
      draftProfile,
      draftGym,
      crowd,
      mood,
    }).catch(() => undefined);
  }, [authHydrating, tokens?.idToken, draftProfile, draftGym, crowd, mood]);

  useEffect(() => {
    if (authHydrating || hydratingSession) {
      return;
    }

    setStoredObject<PersistedWorkoutSession>(STORAGE_KEYS.workoutSession, {
      workout,
      focus,
      currentScreen,
      workoutStartedAt,
      activeExerciseIndex,
      restStartedAt,
      workoutProgress,
      pendingFeedback,
      crowd,
      mood,
    }).catch(() => undefined);
  }, [authHydrating, hydratingSession, workout, focus, currentScreen, workoutStartedAt, activeExerciseIndex, restStartedAt, workoutProgress, pendingFeedback, crowd, mood]);

  const persistDraftSettings = useCallback(async () => {
    if (!tokens?.idToken) {
      return;
    }

    const preparedGym = buildGymFromType(draftGym.type, draftGym);
    const savedGym = await apiRequest<Gym>(
      `/gyms/${CONFIG.gymId}`,
      tokens.idToken,
      'PUT',
      preparedGym,
    );
    const savedProfile = await apiRequest<Profile>(
      '/me',
      tokens.idToken,
      'PUT',
      { ...draftProfile, activeGymId: CONFIG.gymId },
    );

    setGym(savedGym);
    setProfile(savedProfile);
  }, [tokens?.idToken, draftGym, draftProfile]);

  useEffect(() => {
    if (authHydrating) {
      return;
    }

    if (!tokens?.idToken) {
      setProfile(null);
      setGym(null);
      setBootstrapping(false);
      setNeedsOnboarding(false);
      setError('');
      setLoading(false);
      if (!workout && currentScreen === 'workout') {
        setCurrentScreen('home');
      }
      if (!workout && !status) {
        setStatus('Choose a workout and get after it.');
      }
      return;
    }

    let cancelled = false;

    const bootstrap = async () => {
      setBootstrapping(true);
      setLoading(true);
      setError('');
      try {
        const [profileRes, gymRes] = await Promise.all([
          apiRequest<Profile>('/me', tokens.idToken),
          apiRequest<Gym>(`/gyms/${CONFIG.gymId}`, tokens.idToken),
        ]);

        if (!cancelled) {
          setProfile(profileRes);
          setGym(gymRes);
          setNeedsOnboarding(false);
          setDraftProfile({
            ...DEFAULT_PROFILE,
            ...profileRes,
            activeGymId: profileRes.activeGymId || CONFIG.gymId,
            splitPreference: profileRes.splitPreference || DEFAULT_PROFILE.splitPreference,
            painAreas: profileRes.painAreas || [],
            permanentLimitations: profileRes.permanentLimitations || [],
          });
          setDraftGym({
            ...DEFAULT_GYM,
            ...gymRes,
            equipment: { ...DEFAULT_GYM.equipment, ...(gymRes.equipment || {}) },
            notes: gymRes.notes || '',
          });
          setCurrentScreen('home');
          setStatus('Signed in and synced.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not load your account.';
        console.log('[StrengthPilot] Bootstrap failure', {
          message,
        });
        if (!cancelled) {
          if (message.includes('Profile not found') || message.includes('Gym not found')) {
            setNeedsOnboarding(true);
            setStatus('Signed in. Let’s set up your training profile.');
          } else {
            setError(message);
          }
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
          setLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [tokens?.idToken, authHydrating, currentScreen, status, workout]);

  const saveOnboarding = useCallback(async () => {
    if (!tokens?.idToken) {
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Saving profile and gym...');
    try {
      console.log('[StrengthPilot] Save onboarding start', {
        gymType: draftGym.type,
        goal: draftProfile.goal,
        experience: draftProfile.experience,
        daysPerWeek: draftProfile.daysPerWeek,
        sessionLength: draftProfile.sessionLength,
        firstName: draftProfile.firstName || null,
      });
      await persistDraftSettings();
      setNeedsOnboarding(false);
      console.log('[StrengthPilot] Save onboarding success', {
        gymId: CONFIG.gymId,
        activeGymId: CONFIG.gymId,
      });
      setStatus('Onboarding complete. Ready to train.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save onboarding.';
      console.log('[StrengthPilot] Save onboarding failure', {
        message,
      });
      setError(message);
      setStatus('Could not save onboarding.');
    } finally {
      setLoading(false);
    }
  }, [draftGym.type, draftProfile.daysPerWeek, draftProfile.experience, draftProfile.firstName, draftProfile.goal, draftProfile.sessionLength, persistDraftSettings, tokens?.idToken]);

  const generateWorkout = useCallback(async (options?: { openWorkout?: boolean; startOnComplete?: boolean; focus?: string }) => {
    if (!tokens?.idToken) {
      return;
    }
    if (workoutStartedAt && workout) {
      setStatus('Finish or cancel your current workout before starting another.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Building your workout...');
    try {
      await persistDraftSettings();
      const response = await apiRequest<{ workout: Workout; focus: string }>(
        '/workouts/generate',
        tokens.idToken,
        'POST',
        {
          focus: options?.focus,
          dayIndex: 0,
          limitedTime: draftProfile.sessionLength <= 45,
          gymCrowdedness: crowd,
          mood: mood.toLowerCase(),
        },
      );
      setWorkout(response.workout);
      setFocus(response.focus);
      setWorkoutProgress(buildWorkoutProgress(response.workout, draftProfile.experience));
      setActiveExerciseIndex(0);
      setRestStartedAt(null);
      setPendingFeedback(null);
      if (options?.startOnComplete) {
        setWorkoutStartedAt(new Date().toISOString());
      }
      if (options?.openWorkout) {
        setCurrentScreen('workout');
      } else {
        setCurrentScreen('home');
      }
      setStatus('Workout ready.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate workout.');
    } finally {
      setLoading(false);
    }
  }, [tokens?.idToken, workoutStartedAt, workout, draftProfile.experience, draftProfile.sessionLength, crowd, mood, persistDraftSettings]);

  const openWorkout = useCallback(() => {
    if (!workout) {
      return;
    }
    setCurrentScreen('workout');
  }, [workout]);

  const navigateToScreen = useCallback((screen: AppScreen) => {
    if (screen === 'workout' && !workout) {
      return;
    }

    setCurrentScreen(screen);
  }, [workout]);

  const startWorkout = useCallback(async () => {
    if (workout) {
      if (workout.exercises.length === 0) {
        setStatus('Add at least one exercise before starting.');
        setCurrentScreen('workout');
        return;
      }
      if (!workoutStartedAt) {
        setWorkoutStartedAt(new Date().toISOString());
        setStatus('Workout in progress.');
      }
      if (!workoutProgress.length && profile) {
        setWorkoutProgress(buildWorkoutProgress(workout, profile.experience));
      }
      setCurrentScreen('workout');
      return;
    }

    await generateWorkout({ openWorkout: true, startOnComplete: false });
  }, [generateWorkout, workout, workoutStartedAt, workoutProgress.length, profile]);

  const backHome = useCallback(() => {
    setCurrentScreen('home');
    setStatus('Ready');
  }, []);

  const moveWorkoutExercise = useCallback((exerciseIndex: number, direction: 'up' | 'down') => {
    if (!workout) {
      return;
    }

    const targetIndex = direction === 'up' ? exerciseIndex - 1 : exerciseIndex + 1;
    if (targetIndex < 0 || targetIndex >= workout.exercises.length) {
      return;
    }

    const nextExercises = [...workout.exercises];
    const [lift] = nextExercises.splice(exerciseIndex, 1);
    nextExercises.splice(targetIndex, 0, lift);
    const nextWorkout = { ...workout, exercises: nextExercises };
    const nextExperience = profile?.experience || draftProfile.experience;

    setWorkout(nextWorkout);
    setWorkoutProgress(buildWorkoutProgress(nextWorkout, nextExperience));
    setActiveExerciseIndex((current) => {
      if (current === exerciseIndex) {
        return targetIndex;
      }
      if (current === targetIndex) {
        return exerciseIndex;
      }
      return current;
    });
  }, [draftProfile.experience, profile?.experience, workout]);

  const updateWorkoutExerciseTargetSets = useCallback((exerciseIndex: number, targetSets: number) => {
    if (!workout) {
      return;
    }

    const safeTargetSets = Math.max(1, Math.min(8, targetSets));
    const nextWorkout = {
      ...workout,
      exercises: workout.exercises.map((exercise, currentExerciseIndex) =>
        currentExerciseIndex === exerciseIndex
          ? { ...exercise, targetSets: safeTargetSets }
          : exercise,
      ),
    };
    const nextExperience = profile?.experience || draftProfile.experience;

    setWorkout(nextWorkout);
    setWorkoutProgress(buildWorkoutProgress(nextWorkout, nextExperience));
  }, [draftProfile.experience, profile?.experience, workout]);

  const removeWorkoutExercise = useCallback((exerciseIndex: number) => {
    if (!workout || workout.exercises.length <= 1) {
      return;
    }

    const nextExercises = workout.exercises.filter((_, currentExerciseIndex) => currentExerciseIndex !== exerciseIndex);
    const nextWorkout = { ...workout, exercises: nextExercises };
    const nextExperience = profile?.experience || draftProfile.experience;

    setWorkout(nextWorkout);
    setWorkoutProgress(buildWorkoutProgress(nextWorkout, nextExperience));
    setActiveExerciseIndex((current) => Math.max(0, Math.min(current, nextExercises.length - 1)));
  }, [draftProfile.experience, profile?.experience, workout]);

  const insertWorkoutExercise = useCallback((insertIndex: number, exerciseId: string) => {
    if (!workout) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(insertIndex, workout.exercises.length));
    const nextExercises = [...workout.exercises];
    nextExercises.splice(boundedIndex, 0, buildInsertedExercise(exerciseId));
    const nextWorkout = { ...workout, exercises: nextExercises };
    const nextExperience = profile?.experience || draftProfile.experience;

    setWorkout(nextWorkout);
    setWorkoutProgress(buildWorkoutProgress(nextWorkout, nextExperience));
    setStatus('Exercise added to workout.');
  }, [draftProfile.experience, profile?.experience, workout]);

  const removeWorkoutSet = useCallback((exerciseIndex: number, setIndex: number) => {
    if (!workout) {
      return;
    }

    const progressEntry = workoutProgress[exerciseIndex];
    if (!progressEntry || progressEntry.setProgress.length <= 1) {
      return;
    }

    setWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map((exercise, currentExerciseIndex) =>
          currentExerciseIndex === exerciseIndex
            ? {
                ...exercise,
                targetSets: Math.max(1, exercise.targetSets - 1),
              }
            : exercise,
        ),
      };
    });

    setWorkoutProgress((current) =>
      current.map((exerciseProgress, currentExerciseIndex) => {
        if (currentExerciseIndex !== exerciseIndex) {
          return exerciseProgress;
        }

        const remainingSets = exerciseProgress.setProgress.filter((_, currentSetIndex) => currentSetIndex !== setIndex);
        return {
          ...exerciseProgress,
          setProgress: remainingSets.map((setEntry, nextSetIndex) => ({
            ...setEntry,
            setNumber: nextSetIndex + 1,
          })),
        };
      }),
    );

    setPendingFeedback((current) => {
      if (!current || current.exerciseIndex !== exerciseIndex) {
        return current;
      }
      if (current.setIndex === setIndex) {
        return null;
      }
      if (current.setIndex > setIndex) {
        return { ...current, setIndex: current.setIndex - 1 };
      }
      return current;
    });

    setRestStartedAt(null);
    setStatus('Set removed from workout.');
  }, [workout, workoutProgress]);

  const updateWorkoutSetField = useCallback(
    (exerciseIndex: number, setIndex: number, field: 'actualWeight' | 'actualReps', value: string) => {
      setWorkoutProgress((current) =>
        current.map((exercise, currentExerciseIndex) => {
          if (currentExerciseIndex !== exerciseIndex) {
            return exercise;
          }

          return {
            ...exercise,
            setProgress: exercise.setProgress.map((setEntry, currentSetIndex) =>
              currentSetIndex === setIndex
                ? {
                    ...setEntry,
                    [field]: value,
                  }
                : setEntry,
            ),
          };
        }),
      );
    },
    [],
  );

  const completeWorkoutSet = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      if (!workout) {
        return;
      }

      const exercise = workout.exercises[exerciseIndex];
      const progressEntry = workoutProgress[exerciseIndex];
      const setEntry = progressEntry?.setProgress[setIndex];

      if (!exercise || !progressEntry || !setEntry) {
        return;
      }

      if (setEntry.completed) {
        setWorkoutProgress((current) =>
          current.map((exerciseProgress, currentExerciseIndex) => {
            if (currentExerciseIndex !== exerciseIndex) {
              return exerciseProgress;
            }

            return {
              ...exerciseProgress,
              setProgress: exerciseProgress.setProgress.map((currentSetEntry, currentSetIndex) =>
                currentSetIndex === setIndex
                  ? {
                      ...currentSetEntry,
                      completed: false,
                      completedAt: undefined,
                      feedbackScore: undefined,
                      feedbackDismissed: false,
                    }
                  : currentSetEntry,
              ),
            };
          }),
        );

        setPendingFeedback((current) =>
          current && current.exerciseIndex === exerciseIndex && current.setIndex === setIndex
            ? null
            : current,
        );
        setRestStartedAt(null);
        return;
      }

      const completedAt = new Date().toISOString();
      const hitsSuggestedWeight = Number.parseFloat(setEntry.actualWeight || '0') >= setEntry.suggestedWeight;
      const isLastWorkingSet = setIndex === progressEntry.setProgress.length - 1;
      const shouldAskForFeedback = isCompoundExercise(exercise.exerciseId) && isLastWorkingSet && hitsSuggestedWeight;

      setWorkoutProgress((current) =>
        current.map((exerciseProgress, currentExerciseIndex) => {
          if (currentExerciseIndex !== exerciseIndex) {
            return exerciseProgress;
          }

          const nextOpenSetIndex = exerciseProgress.setProgress.findIndex(
            (currentSetEntry, currentSetIndex) => currentSetIndex > setIndex && !currentSetEntry.completed,
          );

          return {
            ...exerciseProgress,
            setProgress: exerciseProgress.setProgress.map((currentSetEntry, currentSetIndex, allSets) => {
              if (currentSetIndex === setIndex) {
                return {
                  ...currentSetEntry,
                  completed: true,
                  completedAt,
                  actualWeight: currentSetEntry.actualWeight || String(currentSetEntry.suggestedWeight),
                  actualReps: currentSetEntry.actualReps || String(currentSetEntry.suggestedReps),
                };
              }

              if (currentSetIndex === nextOpenSetIndex) {
                const completedSet = {
                  ...allSets[setIndex],
                  actualWeight: allSets[setIndex].actualWeight || String(allSets[setIndex].suggestedWeight),
                  actualReps: allSets[setIndex].actualReps || String(allSets[setIndex].suggestedReps),
                };

                return adaptNextSetSuggestion(completedSet, currentSetEntry);
              }

              return currentSetEntry;
            }),
          };
        }),
      );

      setRestStartedAt(completedAt);

      if (shouldAskForFeedback) {
        setPendingFeedback({ exerciseIndex, setIndex });
      } else if (
        exerciseIndex < workout.exercises.length - 1 &&
        progressEntry.setProgress.every((currentSetEntry, currentSetIndex) =>
          currentSetIndex === setIndex ? true : currentSetEntry.completed,
        )
      ) {
        setActiveExerciseIndex(exerciseIndex + 1);
      }
    },
    [workout, workoutProgress],
  );

  const addWorkoutSet = useCallback((exerciseIndex: number) => {
    setWorkoutProgress((current) =>
      current.map((exerciseProgress, currentExerciseIndex) => {
        if (currentExerciseIndex !== exerciseIndex) {
          return exerciseProgress;
        }

        const lastSet = exerciseProgress.setProgress[exerciseProgress.setProgress.length - 1];
        const nextSetNumber = lastSet ? lastSet.setNumber + 1 : 1;

        return {
          ...exerciseProgress,
          setProgress: [
            ...exerciseProgress.setProgress,
            {
              setNumber: nextSetNumber,
              suggestedWeight: lastSet?.suggestedWeight || 0,
              suggestedReps: lastSet?.suggestedReps || 8,
              actualWeight: lastSet?.actualWeight || '',
              actualReps: lastSet?.actualReps || String(lastSet?.suggestedReps || 8),
              completed: false,
            },
          ],
        };
      }),
    );
  }, []);

  const respondToWorkoutFeedback = useCallback((score: number | null) => {
    if (!pendingFeedback) {
      return;
    }

    setWorkoutProgress((current) =>
      current.map((exerciseProgress, currentExerciseIndex) => {
        if (currentExerciseIndex !== pendingFeedback.exerciseIndex) {
          return exerciseProgress;
        }

        return {
          ...exerciseProgress,
          setProgress: exerciseProgress.setProgress.map((setEntry, currentSetIndex) =>
            currentSetIndex === pendingFeedback.setIndex
              ? {
                  ...setEntry,
                  feedbackScore: typeof score === 'number' ? score : setEntry.feedbackScore,
                  feedbackDismissed: score === null ? true : setEntry.feedbackDismissed,
                }
              : setEntry,
          ),
        };
      }),
    );

    if (workout && pendingFeedback.exerciseIndex < workout.exercises.length - 1) {
      setActiveExerciseIndex(pendingFeedback.exerciseIndex + 1);
    }

    setPendingFeedback(null);
  }, [pendingFeedback, workout]);

  const swapWorkoutExercise = useCallback((exerciseIndex: number, exerciseId: string) => {
    if (!workout || !profile) {
      return;
    }

    setWorkout((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        exercises: current.exercises.map((exercise, currentExerciseIndex) =>
          currentExerciseIndex === exerciseIndex
            ? {
                ...exercise,
                exerciseId,
                sets: [],
              }
            : exercise,
        ),
      };
    });

    setWorkoutProgress((current) =>
      current.map((exerciseProgress, currentExerciseIndex) => {
        if (currentExerciseIndex !== exerciseIndex || !workout.exercises[exerciseIndex]) {
          return exerciseProgress;
        }

        return buildExerciseProgress(
          {
            ...workout.exercises[exerciseIndex],
            exerciseId,
            sets: [],
          },
          profile.experience,
        );
      }),
    );

    setPendingFeedback(null);
  }, [profile, workout]);

  const clearWorkoutSession = useCallback((nextStatus: string) => {
    setCurrentScreen('home');
    setWorkout(null);
    setFocus('');
    setWorkoutStartedAt(null);
    setActiveExerciseIndex(0);
    setRestStartedAt(null);
    setWorkoutProgress([]);
    setPendingFeedback(null);
    setStatus(nextStatus);
  }, []);

  const saveWorkout = useCallback(() => {
    clearWorkoutSession('Workout saved.');
  }, [clearWorkoutSession]);

  const cancelWorkout = useCallback(() => {
    clearWorkoutSession('Workout canceled.');
  }, [clearWorkoutSession]);

  const generateGuestWorkout = useCallback(async (category: string) => {
    if (workoutStartedAt && workout) {
      setStatus('Finish or cancel your current workout before starting another.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Building your guest workout...');
    try {
      const response = await publicApiRequest<{ workout: Workout; focus: string }>(
        '/guest/workouts/generate',
        'POST',
        {
          focus: category,
          profile: draftProfile,
          gym: buildGymFromType(draftGym.type, draftGym),
          limitedTime: draftProfile.sessionLength <= 45,
          gymCrowdedness: crowd,
          mood: mood.toLowerCase(),
        },
      );
      setWorkout(response.workout);
      setFocus(response.focus);
      setWorkoutProgress(buildWorkoutProgress(response.workout, draftProfile.experience));
      setActiveExerciseIndex(0);
      setRestStartedAt(null);
      setPendingFeedback(null);
      setWorkoutStartedAt(null);
      setCurrentScreen('workout');
      setStatus(`${humanize(response.focus)} workout ready.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build guest workout.');
    } finally {
      setLoading(false);
    }
  }, [draftGym, draftProfile, crowd, mood, workoutStartedAt, workout]);

  const createCustomWorkout = useCallback(() => {
    if (workoutStartedAt && workout) {
      setStatus('Finish or cancel your current workout before starting another.');
      return;
    }

    const response = buildCustomWorkout(draftProfile);
    setWorkout(response.workout);
    setFocus(response.focus);
    setWorkoutProgress([]);
    setActiveExerciseIndex(0);
    setRestStartedAt(null);
    setPendingFeedback(null);
    setWorkoutStartedAt(null);
    setCurrentScreen('workout');
    setStatus('Custom workout ready. Add your first exercise.');
  }, [draftProfile, workoutStartedAt, workout]);

  const value = useMemo(
    () => ({
      profile,
      gym,
      workout,
      focus,
      bootstrapping,
      hydratingSession,
      needsOnboarding,
      currentScreen,
      workoutStartedAt,
      activeExerciseIndex,
      restStartedAt,
      workoutProgress,
      pendingFeedback,
      isGuestMode,
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
      generateGuestWorkout,
      createCustomWorkout,
      startWorkout,
      openWorkout,
      backHome,
      navigateToScreen,
      moveWorkoutExercise,
      updateWorkoutExerciseTargetSets,
      removeWorkoutExercise,
      insertWorkoutExercise,
      removeWorkoutSet,
      setActiveExerciseIndex,
      updateWorkoutSetField,
      completeWorkoutSet,
      addWorkoutSet,
      respondToWorkoutFeedback,
      swapWorkoutExercise,
      saveWorkout,
      cancelWorkout,
    }),
    [
      profile,
      gym,
      workout,
      focus,
      bootstrapping,
      hydratingSession,
      needsOnboarding,
      currentScreen,
      workoutStartedAt,
      activeExerciseIndex,
      restStartedAt,
      workoutProgress,
      pendingFeedback,
      isGuestMode,
      draftProfile,
      draftGym,
      crowd,
      mood,
      status,
      error,
      loading,
      saveOnboarding,
      generateWorkout,
      generateGuestWorkout,
      createCustomWorkout,
      startWorkout,
      openWorkout,
      backHome,
      navigateToScreen,
      moveWorkoutExercise,
      updateWorkoutExerciseTargetSets,
      removeWorkoutExercise,
      insertWorkoutExercise,
      removeWorkoutSet,
      setActiveExerciseIndex,
      updateWorkoutSetField,
      completeWorkoutSet,
      addWorkoutSet,
      respondToWorkoutFeedback,
      swapWorkoutExercise,
      saveWorkout,
      cancelWorkout,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
