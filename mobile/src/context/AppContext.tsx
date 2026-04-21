import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { CONFIG } from '../config/appConfig';
import { buildGymFromType, DEFAULT_GYM, DEFAULT_PROFILE } from '../constants/defaults';
import { apiRequest } from '../services/api';
import { getStoredObject, removeStoredValue, setStoredObject, STORAGE_KEYS } from '../services/storage';
import type { Crowd, Gym, Profile, Workout } from '../types/app';
import { useAuth } from '../hooks/useAuth';

type PersistedWorkoutSession = {
  workout: Workout | null;
  focus: string;
  currentScreen: 'home' | 'workout';
  workoutStartedAt: string | null;
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
  currentScreen: 'home' | 'workout';
  workoutStartedAt: string | null;
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
  generateWorkout: (options?: { openWorkout?: boolean; startOnComplete?: boolean }) => Promise<void>;
  startWorkout: () => Promise<void>;
  openWorkout: () => void;
  backHome: () => void;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { tokens, hydrating: authHydrating } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [focus, setFocus] = useState('');
  const [bootstrapping, setBootstrapping] = useState(false);
  const [hydratingSession, setHydratingSession] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'workout'>('home');
  const [workoutStartedAt, setWorkoutStartedAt] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftProfile, setDraftProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draftGym, setDraftGym] = useState<Gym>(DEFAULT_GYM);
  const [crowd, setCrowd] = useState<Crowd>('medium');
  const [mood, setMood] = useState('Ready');

  useEffect(() => {
    if (authHydrating) {
      return;
    }

    if (!tokens?.idToken) {
      setHydratingSession(false);
      return;
    }

    const storedSession = getStoredObject<PersistedWorkoutSession>(STORAGE_KEYS.workoutSession);
    if (storedSession) {
      setWorkout(storedSession.workout);
      setFocus(storedSession.focus);
      setCurrentScreen(storedSession.currentScreen);
      setWorkoutStartedAt(storedSession.workoutStartedAt);
      setCrowd(storedSession.crowd);
      setMood(storedSession.mood);
    }
    setHydratingSession(false);
  }, [tokens?.idToken, authHydrating]);

  useEffect(() => {
    if (authHydrating || hydratingSession) {
      return;
    }

    if (!tokens?.idToken) {
      removeStoredValue(STORAGE_KEYS.workoutSession);
      return;
    }

    setStoredObject<PersistedWorkoutSession>(STORAGE_KEYS.workoutSession, {
      workout,
      focus,
      currentScreen,
      workoutStartedAt,
      crowd,
      mood,
    });
  }, [tokens?.idToken, authHydrating, hydratingSession, workout, focus, currentScreen, workoutStartedAt, crowd, mood]);

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
      setWorkout(null);
      setFocus('');
      setBootstrapping(false);
      setHydratingSession(false);
      setNeedsOnboarding(false);
      setCurrentScreen('home');
      setWorkoutStartedAt(null);
      setDraftProfile(DEFAULT_PROFILE);
      setDraftGym(DEFAULT_GYM);
      setCrowd('medium');
      setMood('Ready');
      setStatus('Ready');
      setError('');
      setLoading(false);
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
  }, [tokens?.idToken, authHydrating]);

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

  const generateWorkout = useCallback(async (options?: { openWorkout?: boolean; startOnComplete?: boolean }) => {
    if (!tokens?.idToken) {
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
          dayIndex: 0,
          limitedTime: draftProfile.sessionLength <= 45,
          gymCrowdedness: crowd,
          mood: mood.toLowerCase(),
        },
      );
      setWorkout(response.workout);
      setFocus(response.focus);
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
  }, [tokens?.idToken, draftProfile.sessionLength, crowd, mood, persistDraftSettings]);

  const openWorkout = useCallback(() => {
    if (!workout) {
      return;
    }
    setCurrentScreen('workout');
  }, [workout]);

  const startWorkout = useCallback(async () => {
    if (workout) {
      if (!workoutStartedAt) {
        setWorkoutStartedAt(new Date().toISOString());
      }
      setCurrentScreen('workout');
      return;
    }

    await generateWorkout({ openWorkout: true, startOnComplete: true });
  }, [generateWorkout, workout, workoutStartedAt]);

  const backHome = useCallback(() => {
    setCurrentScreen('home');
    setStatus('Ready');
  }, []);

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
      startWorkout,
      openWorkout,
      backHome,
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
      draftProfile,
      draftGym,
      crowd,
      mood,
      status,
      error,
      loading,
      saveOnboarding,
      generateWorkout,
      startWorkout,
      openWorkout,
      backHome,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
