import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { humanize } from '../../utils/format';
import { HomeHeroCard } from './HomeHeroCard';
import { homeCardStyles } from './HomeCard.styles';
import { WorkoutPreferencesModal } from '../shared/WorkoutPreferencesModal';

function formatElapsed(startedAt: string, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function HomeCard() {
  const { palette } = useTheme();
  const {
    profile,
    gym,
    workout,
    focus,
    crowd,
    mood,
    loading,
    draftProfile,
    draftGym,
    workoutStartedAt,
    setDraftProfile,
    setDraftGym,
    setCrowd,
    setMood,
    generateWorkout,
    startWorkout,
  } = useAppState();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!workoutStartedAt) {
      return;
    }

    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, [workoutStartedAt]);

  if (!profile || !gym) {
    return null;
  }

  const firstName = profile.firstName?.trim() || 'Athlete';
  const dayOfWeek = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date());
  const assignedWorkoutLabel = workout ? humanize(focus || profile.goal) : '';
  const dayHeading = assignedWorkoutLabel ? `${dayOfWeek} (${assignedWorkoutLabel})` : dayOfWeek;
  const workoutTitle = workout ? `${humanize(focus || profile.goal)} Session` : `${humanize(profile.goal)} Focus`;
  const focusLabel = workout ? humanize(focus || profile.goal) : `${humanize(profile.goal)} priority`;
  const timerText = workoutStartedAt ? formatElapsed(workoutStartedAt, now) : '';
  const alternativeWorkouts = [
    {
      key: 'quick',
      title: 'Quick 30 Min',
      detail: `Compressed ${humanize(profile.goal)} session`,
    },
    {
      key: 'home',
      title: draftGym.type === 'home' ? 'Home Workout' : 'Home Gym Mode',
      detail: 'Simplified equipment list and substitutions',
    },
    {
      key: 'crowded',
      title: 'Gym Crowded Mode',
      detail: 'Machine-friendly swaps and tighter movement flow',
    },
  ];

  const handleUpdatePreferences = () => {
    generateWorkout({ openWorkout: false, startOnComplete: false })
      .then(() => setIsPreferencesOpen(false))
      .catch(() => undefined);
  };

  return (
    <>
      <HomeHeroCard
        dayHeading={dayHeading}
        timerText={timerText}
        firstName={firstName}
        workoutStartedAt={workoutStartedAt}
        workoutTitle={workoutTitle}
        focusLabel={focusLabel}
        sessionLength={profile.sessionLength}
        loading={loading}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onStartWorkout={() => startWorkout().catch(() => undefined)}
      />

      <View style={homeCardStyles.homeAltSection}>
        <View style={homeCardStyles.homeAltHeaderRow}>
          <Text style={[homeCardStyles.homeAltTitle, { color: palette.text }]}>Suggested Alternatives</Text>
          <Text style={[homeCardStyles.homeAltDots, { color: palette.muted }]}>...</Text>
        </View>
        {alternativeWorkouts.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setIsPreferencesOpen(true)}
            style={[homeCardStyles.homeAltCard, { backgroundColor: palette.card, borderColor: palette.line }]}
          >
            <Text style={[homeCardStyles.homeAltCardTitle, { color: palette.text }]}>{item.title}</Text>
            <Text style={[homeCardStyles.homeAltCardDetail, { color: palette.muted }]}>{item.detail}</Text>
          </Pressable>
        ))}
      </View>

      <WorkoutPreferencesModal
        visible={isPreferencesOpen}
        loading={loading}
        draftProfile={draftProfile}
        draftGym={draftGym}
        crowd={crowd}
        mood={mood}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handleUpdatePreferences}
        setDraftProfile={setDraftProfile}
        setDraftGym={setDraftGym}
        setCrowd={setCrowd}
        setMood={setMood}
      />
    </>
  );
}
