import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useTheme } from '../../hooks/useTheme';
import type { Workout, WorkoutExerciseProgress } from '../../types/app';
import { getThumbnailForExercise } from './activeWorkoutHelpers';

type TodaysWorkoutPanelProps = {
  workout: Workout;
  activeExerciseIndex: number;
  nextExerciseIndex: number;
  workoutProgress: WorkoutExerciseProgress[];
  onOpenExercise: (index: number) => void;
  onAddExercise: () => void;
};

export function TodaysWorkoutPanel({
  workout,
  activeExerciseIndex,
  nextExerciseIndex,
  workoutProgress,
  onOpenExercise,
  onAddExercise,
}: TodaysWorkoutPanelProps) {
  const { palette } = useTheme();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Today's Workout</Text>
        <Text style={[styles.sectionBody, { color: palette.muted }]}>Stay focused. You've got this.</Text>
      </View>

      <View style={[styles.listCard, { backgroundColor: palette.panel }]}>
        {workout.exercises.map((exercise, index) => {
          const meta = getExerciseMeta(exercise.exerciseId);
          const progress = workoutProgress[index];
          const completedSets = progress ? progress.setProgress.filter((setEntry) => setEntry.completed).length : 0;
          const isCurrent = index === activeExerciseIndex;
          const isCompleted = progress ? progress.setProgress.length > 0 && progress.setProgress.every((setEntry) => setEntry.completed) : false;
          const isFuture = index > activeExerciseIndex && !isCompleted;
          const isUpNext = index === nextExerciseIndex && !isCompleted;
          const thumbnail = getThumbnailForExercise(meta.primaryMuscles);

          return (
            <View key={`${exercise.exerciseId}-${index}`}>
              <Pressable
                onPress={() => onOpenExercise(index)}
                style={[styles.exerciseRow, isFuture ? styles.exerciseRowFuture : null]}
              >
                {isCompleted ? (
                  <View style={[styles.stepBadge, styles.stepBadgeCompleted]}>
                    <Text style={[styles.stepBadgeCheck, styles.stepBadgeCheckCompleted]}>✓</Text>
                  </View>
                ) : (
                  <View style={[styles.stepBadge, { backgroundColor: palette.input, borderColor: isCurrent ? palette.accent : palette.line }]}>
                    <Text style={[styles.stepBadgeText, { color: isCurrent ? palette.accent : palette.text }]}>{index + 1}</Text>
                  </View>
                )}
                <View style={[styles.thumbnailWrap, { backgroundColor: palette.input, borderColor: palette.line }]}>
                  <Image source={thumbnail} resizeMode="cover" style={styles.thumbnail} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>{meta.displayName}</Text>
                  <Text style={[styles.rowMeta, { color: palette.muted }]}>
                    {exercise.targetSets} sets
                    {exercise.targetReps ? ` • ${exercise.targetReps} reps` : ''}
                    {exercise.restSeconds ? ` • ${exercise.restSeconds >= 60 ? `${Math.round(exercise.restSeconds / 60)} min` : `${exercise.restSeconds} sec`} rest` : ''}
                  </Text>
                  {isCompleted || completedSets > 0 ? (
                    <View style={[styles.pill, styles.pillCompleted]}>
                      <Text style={[styles.pillText, styles.pillTextCompleted]}>
                        {completedSets} / {progress?.setProgress.length || exercise.targetSets} Sets Completed
                      </Text>
                    </View>
                  ) : isUpNext ? (
                    <View style={[styles.pill, styles.pillUpNext, { backgroundColor: palette.badge }]}>
                      <Text style={[styles.pillText, { color: palette.accent }]}>Up Next</Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.rowChevronWrap, { backgroundColor: palette.input, borderColor: palette.line }]}>
                  <Text style={[styles.rowChevron, { color: palette.muted }]}>›</Text>
                </View>
              </Pressable>
              {index < workout.exercises.length - 1 ? (
                <View style={[styles.rowSeparator, { backgroundColor: palette.line }]} />
              ) : null}
            </View>
          );
        })}

        <View style={styles.addExerciseWrap}>
          <Pressable
            onPress={onAddExercise}
            style={[styles.addExerciseButton, { backgroundColor: palette.panel, borderColor: palette.accent }]}
          >
            <Text style={[styles.addExerciseButtonText, { color: palette.accent }]}>+ Add Exercise</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
  },
  sectionBody: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    opacity: 0.8,
  },
  listCard: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  exerciseRow: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseRowFuture: {
    opacity: 0.8,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeCompleted: {
    backgroundColor: '#163120',
    borderColor: '#2d6b43',
  },
  stepBadgeText: {
    fontSize: 11,
    lineHeight: 11,
    fontWeight: '600',
  },
  stepBadgeCheck: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: '700',
  },
  stepBadgeCheckCompleted: {
    color: '#7fc88f',
  },
  thumbnailWrap: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  rowCopy: {
    flex: 1,
    gap: 0,
  },
  rowTitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: -0.05,
  },
  rowMeta: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '400',
    opacity: 0.56,
  },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  pillCompleted: {
    backgroundColor: '#12271a',
    borderColor: '#3e8a57',
  },
  pillUpNext: {
    borderColor: 'transparent',
  },
  pillText: {
    fontSize: 9,
    lineHeight: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  pillTextCompleted: {
    color: '#78b989',
  },
  rowChevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  rowChevron: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    opacity: 0.55,
  },
  rowSeparator: {
    height: 1,
    marginLeft: 50,
    opacity: 0.45,
  },
  addExerciseWrap: {
    paddingTop: 6,
  },
  addExerciseButton: {
    minHeight: 36,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExerciseButtonText: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: '400',
  },
});
