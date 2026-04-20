import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { CONFIG } from '../config/appConfig';
import { buildGymFromType, DEFAULT_GYM, DEFAULT_PROFILE } from '../constants/defaults';
import { apiRequest } from '../services/api';
import type { Crowd, Gym, Profile, Workout } from '../types/app';
import { useAuth } from '../hooks/useAuth';

type AppContextValue = {
  profile: Profile | null;
  gym: Gym | null;
  workout: Workout | null;
  focus: string;
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
  generateWorkout: () => Promise<void>;
  backHome: () => void;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { tokens } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [focus, setFocus] = useState('');
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftProfile, setDraftProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draftGym, setDraftGym] = useState<Gym>(DEFAULT_GYM);
  const [crowd, setCrowd] = useState<Crowd>('medium');
  const [mood, setMood] = useState('Ready');

  useEffect(() => {
    if (!tokens?.idToken) {
      setProfile(null);
      setGym(null);
      setWorkout(null);
      setFocus('');
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
          setDraftProfile({
            ...DEFAULT_PROFILE,
            ...profileRes,
            activeGymId: profileRes.activeGymId || CONFIG.gymId,
            painAreas: profileRes.painAreas || [],
            permanentLimitations: profileRes.permanentLimitations || [],
          });
          setDraftGym({
            ...DEFAULT_GYM,
            ...gymRes,
            equipment: { ...DEFAULT_GYM.equipment, ...(gymRes.equipment || {}) },
            notes: gymRes.notes || '',
          });
          setStatus('Signed in and synced.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not load your account.';
        console.log('[StrengthPilot] Bootstrap failure', {
          message,
        });
        if (!cancelled) {
          if (message.includes('Profile not found') || message.includes('Gym not found')) {
            setStatus('Signed in. Let’s set up your training profile.');
          } else {
            setError(message);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [tokens?.idToken]);

  const saveOnboarding = useCallback(async () => {
    if (!tokens?.idToken) {
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Saving profile and gym...');
    try {
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
      setStatus('Onboarding complete. Ready to train.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save onboarding.';
      console.log('[StrengthPilot] Save onboarding failure', {
        message,
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [tokens?.idToken, draftGym, draftProfile]);

  const generateWorkout = useCallback(async () => {
    if (!tokens?.idToken) {
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Building your workout...');
    try {
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
      setStatus('Workout ready.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate workout.');
    } finally {
      setLoading(false);
    }
  }, [tokens?.idToken, draftProfile.sessionLength, crowd, mood]);

  const backHome = useCallback(() => {
    setWorkout(null);
    setStatus('Choose when you want to go again.');
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
      saveOnboarding,
      generateWorkout,
      backHome,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
