import React from 'react';
import { Text, View } from 'react-native';

import { EXERCISE_NAMES } from '../constants/exercises';
import { styles } from '../theme/styles';
import type { Palette, Workout } from '../types/app';
import { humanize } from '../utils/format';
import { ActionButton } from './ActionButton';
import { SectionHeading } from './SectionHeading';

type Props = {
  palette: Palette;
  workout: Workout;
  focus: string;
  onBack: () => void;
};

export function WorkoutCard({ palette, workout, focus, onBack }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <SectionHeading palette={palette} eyebrow="Workout" title={`${humanize(focus)} session`} />
      <View style={[styles.workoutBanner, { backgroundColor: palette.badge, borderColor: palette.accentSoft }]}>
        <Text style={[styles.workoutBannerText, { color: palette.text }]}>
          {workout.durationMinutes} minutes · {workout.exercises.length} movements
        </Text>
      </View>

      {workout.exercises.map((exercise, index) => (
        <View
          key={`${exercise.exerciseId}-${index}`}
          style={[styles.exerciseCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
        >
          <Text style={[styles.exerciseName, { color: palette.text }]}>
            {EXERCISE_NAMES[exercise.exerciseId] || humanize(exercise.exerciseId)}
          </Text>
          <Text style={[styles.exerciseMeta, { color: palette.muted }]}>
            {exercise.targetSets} sets · {exercise.targetReps} reps · {exercise.restSeconds}s rest
          </Text>
        </View>
      ))}

      <ActionButton palette={palette} label="Back To Home" onPress={onBack} />
    </View>
  );
}
