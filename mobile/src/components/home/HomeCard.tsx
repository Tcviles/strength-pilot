import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { humanize } from '../../utils/format';
import { HomeHeroCard } from './HomeHeroCard';
import { homeCardStyles } from './HomeCard.styles';
import { ActionButton } from '../shared/ActionButton';
import { OptionRow } from '../shared/OptionRow';

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

      <Modal visible={isPreferencesOpen} animationType="fade" transparent onRequestClose={() => setIsPreferencesOpen(false)}>
        <View style={homeCardStyles.modalBackdrop}>
          <Pressable style={homeCardStyles.modalScrim} onPress={() => setIsPreferencesOpen(false)} />
          <View style={[homeCardStyles.preferencesCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <Text style={[homeCardStyles.preferencesEyebrow, { color: palette.accent }]}>TODAY&apos;S CONTROLS</Text>
            <Text style={[homeCardStyles.preferencesTitle, { color: palette.text }]}>Tune today&apos;s recommendation</Text>

            <OptionRow
              label="Goal"
              options={['strength', 'hypertrophy', 'fat_loss', 'general']}
              selected={draftProfile.goal}
              onSelect={(value) => setDraftProfile({ ...draftProfile, goal: value as typeof draftProfile.goal })}
            />
            <OptionRow
              label="Session length"
              options={['30', '45', '60', '90']}
              selected={String(draftProfile.sessionLength)}
              onSelect={(value) => setDraftProfile({ ...draftProfile, sessionLength: Number(value) })}
            />
            <OptionRow
              label="Gym type"
              options={['commercial', 'home', 'hotel']}
              selected={draftGym.type}
              onSelect={(value) => setDraftGym({ ...draftGym, type: value as typeof draftGym.type })}
            />
            <OptionRow
              label="Crowd"
              options={['low', 'medium', 'high']}
              selected={crowd}
              onSelect={(value) => setCrowd(value as typeof crowd)}
            />
            <View style={homeCardStyles.preferencesInputWrap}>
              <Text style={[homeCardStyles.preferencesInputLabel, { color: palette.text }]}>Mood</Text>
              <TextInput
                placeholder="How are you feeling?"
                placeholderTextColor={palette.placeholder}
                style={[homeCardStyles.preferencesInput, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
                value={mood}
                onChangeText={setMood}
              />
            </View>

            <View style={homeCardStyles.preferencesFooter}>
              <ActionButton label="Close" onPress={() => setIsPreferencesOpen(false)} />
              <ActionButton label={loading ? 'Updating...' : 'Update'} disabled={loading} onPress={handleUpdatePreferences} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
