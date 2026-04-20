import React from 'react';
import { Text, View } from 'react-native';

import { EXERCISE_NAMES } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';
import { humanize } from '../../utils/format';
import { ActionButton } from '../shared/ActionButton';
import { SectionHeading } from '../shared/SectionHeading';

export function WorkoutCard() {
  const { palette } = useTheme();
  const { workout, focus, backHome } = useAppState();

  if (!workout) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <SectionHeading eyebrow="Workout" title={`${humanize(focus)} session`} />
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

      <ActionButton label="Back To Home" onPress={backHome} />
    </View>
  );
}
