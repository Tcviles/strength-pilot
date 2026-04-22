import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { PreferencesButton } from '../shared/PreferencesButton';
import { WorkoutPreferencesModal } from '../shared/WorkoutPreferencesModal';
import { guestHomeCardStyles } from './GuestHomeCard.styles';

type GuestWorkoutOption = {
  key: string;
  label: string;
  detail: string;
  emphasis?: string;
};

const GUEST_WORKOUT_OPTIONS: GuestWorkoutOption[] = [
  { key: 'push', label: 'Push', detail: 'Chest, shoulders, and triceps' },
  { key: 'pull', label: 'Pull', detail: 'Back, rear delts, and biceps' },
  { key: 'legs', label: 'Legs', detail: 'Quads, glutes, and hamstrings', emphasis: 'Isolation' },
  { key: 'upper_body', label: 'Upper Body', detail: 'Balanced upper session' },
  { key: 'lower_body', label: 'Lower Body', detail: 'Squat, hinge, and accessories', emphasis: 'Compound' },
  { key: 'chest', label: 'Chest', detail: 'Pressing and fly variations' },
  { key: 'back', label: 'Back', detail: 'Rows, pulldowns, and hinges' },
  { key: 'shoulders', label: 'Shoulders', detail: 'Presses, raises, and rear delts' },
  { key: 'arms', label: 'Arms', detail: 'Biceps and triceps pump work' },
  { key: 'abs', label: 'Abs', detail: 'Core-focused finisher day' },
  { key: 'full_body', label: 'Full Body', detail: 'One-session full sweep' },
];

const WORKOUT_THUMBNAILS = {
  abs: require('../../media/WorkoutThumbnails/AbHighlight.png'),
  arms: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  push: require('../../media/WorkoutThumbnails/PushHighlight.png'),
  pull: require('../../media/WorkoutThumbnails/PullHighlight.png'),
  chest: require('../../media/WorkoutThumbnails/ChestHighlight.png'),
  back: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  full_body: require('../../media/WorkoutThumbnails/FullBodyHighlight.png'),
  legs: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  lower_body: require('../../media/WorkoutThumbnails/LowerHighlight.png'),
  upper_body: require('../../media/WorkoutThumbnails/UpperHighlight.png'),
  shoulders: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
} as const;

export function GuestHomeCard() {
  const { palette } = useTheme();
  const {
    workout,
    focus,
    loading,
    workoutStartedAt,
    draftProfile,
    draftGym,
    crowd,
    mood,
    setDraftProfile,
    setDraftGym,
    setCrowd,
    setMood,
    openWorkout,
    startWorkout,
    generateGuestWorkout,
  } = useAppState();
  const [now, setNow] = useState(Date.now());
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const elapsedSeconds = workoutStartedAt
    ? Math.max(0, Math.floor((now - new Date(workoutStartedAt).getTime()) / 1000))
    : 0;
  const timerMinutes = Math.floor(elapsedSeconds / 60);
  const timerSeconds = elapsedSeconds % 60;
  const timerLabel = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

  return (
    <>
      <View style={guestHomeCardStyles.screen}>
        <View style={guestHomeCardStyles.heroTopRow}>
          <View style={guestHomeCardStyles.heroTopSpacer} />
          <View style={guestHomeCardStyles.timerWrap}>
            <ImageBackground
              source={require('../../media/ClockHalo.png')}
              resizeMode="contain"
              style={guestHomeCardStyles.timerRing}
              imageStyle={guestHomeCardStyles.timerHalo}
            >
              <Text style={[guestHomeCardStyles.timerValue, { color: palette.text }]}>{timerLabel}</Text>
              <Text style={[guestHomeCardStyles.timerSubtext, { color: palette.muted }]}>
                {workoutStartedAt ? 'active' : 'guest'}
              </Text>
            </ImageBackground>
          </View>
          <View style={guestHomeCardStyles.heroActions}>
            <PreferencesButton onPress={() => setShowPreferences(true)} />
          </View>
        </View>

        <View style={guestHomeCardStyles.heroCopyBlock}>
          <Text style={[guestHomeCardStyles.heroEyebrow, { color: palette.text }]}>GUEST MODE</Text>
          <Text style={[guestHomeCardStyles.heroTitle, { color: palette.text }]}>Choose a Workout</Text>
          <Text style={[guestHomeCardStyles.heroBody, { color: palette.muted }]}>Select a workout to get started.</Text>
        </View>

        {workout ? (
          <View style={[guestHomeCardStyles.activeGuestCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <Text style={[guestHomeCardStyles.activeGuestEyebrow, { color: palette.accent }]}>
              {workoutStartedAt ? 'CURRENTLY LOADED' : 'READY TO GO'}
            </Text>
            <Text style={[guestHomeCardStyles.activeGuestTitle, { color: palette.text }]}>
              {focus || 'Guest Workout'}
            </Text>
            <Text style={[guestHomeCardStyles.activeGuestMeta, { color: palette.muted }]}>
              {workout.exercises.length} movements · {workout.durationMinutes} minutes
            </Text>
            <ActionButton
              label={workoutStartedAt ? 'Continue Workout' : 'Open Workout'}
              disabled={loading}
              onPress={() => {
                if (workoutStartedAt) {
                  openWorkout();
                } else {
                  startWorkout().catch(() => undefined);
                }
              }}
            />
          </View>
        ) : null}

        <View style={guestHomeCardStyles.optionList}>
          {GUEST_WORKOUT_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => generateGuestWorkout(option.key).catch(() => undefined)}
              style={[guestHomeCardStyles.optionRowCard, { backgroundColor: palette.card, borderColor: palette.line }]}
            >
              <View style={[guestHomeCardStyles.optionArt, { backgroundColor: palette.panel, borderColor: palette.line }]}>
                {Object.prototype.hasOwnProperty.call(WORKOUT_THUMBNAILS, option.key) ? (
                  <Image
                    source={WORKOUT_THUMBNAILS[option.key as keyof typeof WORKOUT_THUMBNAILS]}
                    style={guestHomeCardStyles.optionThumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={[guestHomeCardStyles.optionArtLabel, { color: palette.accent }]}>
                    {option.label.slice(0, 1)}
                  </Text>
                )}
              </View>
              <View style={guestHomeCardStyles.optionCopy}>
                <View style={guestHomeCardStyles.optionTitleRow}>
                  <Text style={[guestHomeCardStyles.optionLabel, { color: palette.text }]}>{option.label}</Text>
                  {option.emphasis ? (
                    <View style={[guestHomeCardStyles.optionBadge, { backgroundColor: palette.badge, borderColor: palette.line }]}>
                      <Text style={[guestHomeCardStyles.optionBadgeText, { color: palette.accent }]}>
                        {option.emphasis}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[guestHomeCardStyles.optionDetail, { color: palette.muted }]}>{option.detail}</Text>
              </View>
              <Text style={[guestHomeCardStyles.optionChevron, { color: palette.muted }]}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <WorkoutPreferencesModal
        visible={showPreferences}
        loading={loading}
        draftProfile={draftProfile}
        draftGym={draftGym}
        crowd={crowd}
        mood={mood}
        onClose={() => setShowPreferences(false)}
        onSave={() => setShowPreferences(false)}
        setDraftProfile={setDraftProfile}
        setDraftGym={setDraftGym}
        setCrowd={setCrowd}
        setMood={setMood}
      />
    </>
  );
}
