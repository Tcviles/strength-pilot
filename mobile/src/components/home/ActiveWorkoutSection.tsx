import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { WorkoutExercisePickerModal } from '../workout/WorkoutExercisePickerModal';
import { CurrentWorkoutCard } from './CurrentWorkoutCard';
import { TodaysWorkoutPanel } from './TodaysWorkoutPanel';

type ActiveWorkoutSectionProps = {
  showCurrentCard?: boolean;
};

export function ActiveWorkoutSection({ showCurrentCard = true }: ActiveWorkoutSectionProps) {
  const {
    workout,
    focus,
    workoutStartedAt,
    restStartedAt,
    activeExerciseIndex,
    workoutProgress,
    openWorkout,
    setActiveExerciseIndex,
    insertWorkoutExercise,
  } = useAppState();
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  React.useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const activeExercise = workout?.exercises[activeExerciseIndex];
  const workoutSeconds = workoutStartedAt
    ? Math.max(0, Math.floor((now - new Date(workoutStartedAt).getTime()) / 1000))
    : 0;
  const restSeconds = useMemo(() => {
    if (!restStartedAt || !activeExercise) {
      return 0;
    }
    const elapsed = Math.max(0, Math.floor((now - new Date(restStartedAt).getTime()) / 1000));
    return Math.max(0, activeExercise.restSeconds - elapsed);
  }, [activeExercise, now, restStartedAt]);

  if (!workout || !workoutStartedAt) {
    return null;
  }

  const nextExerciseIndex = workout.exercises.findIndex((_, index) => index > activeExerciseIndex);

  return (
    <>
      <View style={activeWorkoutSectionStyles.section}>
        {showCurrentCard ? (
          <CurrentWorkoutCard
            focus={focus}
            now={now}
            workoutStartedAt={workoutStartedAt}
            workoutSeconds={workoutSeconds}
            restSeconds={restSeconds}
            onContinue={openWorkout}
          />
        ) : null}

        <TodaysWorkoutPanel
          workout={workout}
          activeExerciseIndex={activeExerciseIndex}
          nextExerciseIndex={nextExerciseIndex}
          workoutProgress={workoutProgress}
          onOpenExercise={(index) => {
            setActiveExerciseIndex(index);
            openWorkout();
          }}
          onAddExercise={() => setShowAddExerciseModal(true)}
        />
      </View>

      <WorkoutExercisePickerModal
        visible={showAddExerciseModal}
        title="Add Exercise"
        onClose={() => setShowAddExerciseModal(false)}
        onSelect={(exerciseId) => insertWorkoutExercise(workout.exercises.length, exerciseId)}
      />
    </>
  );
}

const activeWorkoutSectionStyles = StyleSheet.create({
  section: {
    gap: 10
  },
});
