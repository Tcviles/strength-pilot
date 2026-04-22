import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { humanize } from '../../utils/format';
import { workoutTopBarStyles } from './WorkoutTopBar.styles';

function formatClock(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function WorkoutTopBar() {
  const { palette } = useTheme();
  const { workout, workoutStartedAt, activeExerciseIndex, focus } = useAppState();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeExercise = workout?.exercises[activeExerciseIndex];
  const activeExerciseName = useMemo(
    () => (activeExercise ? getExerciseMeta(activeExercise.exerciseId).name : ''),
    [activeExercise],
  );

  if (!workout || !activeExercise) {
    return null;
  }

  const elapsed = workoutStartedAt
    ? formatClock(Math.floor((now - new Date(workoutStartedAt).getTime()) / 1000))
    : '00:00';

  return (
    <View style={workoutTopBarStyles.barWrap}>
      <View style={[workoutTopBarStyles.bar, { backgroundColor: palette.card, borderColor: palette.line }]}>
        <View style={workoutTopBarStyles.left}>
          <Text style={[workoutTopBarStyles.eyebrow, { color: palette.accent }]}>
            {humanize(focus)} session
          </Text>
          <Text
            numberOfLines={1}
            style={[workoutTopBarStyles.title, { color: palette.text }]}
          >
            {activeExerciseName}
          </Text>
          <Text style={[workoutTopBarStyles.subtitle, { color: palette.muted }]}>
            Exercise {activeExerciseIndex + 1} of {workout.exercises.length}
          </Text>
        </View>
        <View style={workoutTopBarStyles.right}>
          <Text style={[workoutTopBarStyles.timerValue, { color: palette.text }]}>{elapsed}</Text>
          <Text style={[workoutTopBarStyles.timerLabel, { color: palette.muted }]}>workout clock</Text>
        </View>
      </View>
    </View>
  );
}
