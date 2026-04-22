import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { ExerciseInfoModal } from '../shared/ExerciseInfoModal';
import { workoutCardStyles } from './WorkoutCard.styles';

const FEEDBACK_OPTIONS = [
  'Not even close',
  'Probably not',
  'Maybe 1-2 more reps',
  'Maybe 3-4 more reps',
  'Definitely 5+ more reps',
];

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

export function WorkoutCard() {
  const { palette } = useTheme();
  const {
    workout,
    activeExerciseIndex,
    restStartedAt,
    workoutProgress,
    pendingFeedback,
    setActiveExerciseIndex,
    updateWorkoutSetField,
    completeWorkoutSet,
    addWorkoutSet,
    respondToWorkoutFeedback,
    swapWorkoutExercise,
    saveWorkout,
    cancelWorkout,
  } = useAppState();
  const [now, setNow] = useState(Date.now());
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeExercise = workout?.exercises[activeExerciseIndex];
  const activeProgress = workoutProgress[activeExerciseIndex];
  const nextExercise = workout?.exercises[activeExerciseIndex + 1] || null;
  const restElapsedSeconds = restStartedAt
    ? Math.max(0, Math.floor((now - new Date(restStartedAt).getTime()) / 1000))
    : 0;
  const restRemainingSeconds = Math.max(0, activeExercise?.restSeconds ? activeExercise.restSeconds - restElapsedSeconds : 0);
  const restFinished = Boolean(restStartedAt && activeExercise && restElapsedSeconds >= activeExercise.restSeconds);

  const exerciseMeta = useMemo(
    () => (activeExercise ? getExerciseMeta(activeExercise.exerciseId) : null),
    [activeExercise],
  );

  const feedbackTarget = pendingFeedback
    ? workoutProgress[pendingFeedback.exerciseIndex]?.setProgress[pendingFeedback.setIndex]
    : null;

  if (!workout || !activeExercise || !activeProgress || !exerciseMeta) {
    return null;
  }

  const latestCompletedSet = [...activeProgress.setProgress]
    .filter((setEntry) => setEntry.completed)
    .sort((a, b) => b.setNumber - a.setNumber)[0];
  const showRestBanner = Boolean(latestCompletedSet && restStartedAt);

  return (
    <View style={workoutCardStyles.screen}>
      <View style={[workoutCardStyles.stageCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
        <View style={workoutCardStyles.exerciseHeaderRow}>
          <View style={workoutCardStyles.exerciseHeaderCopy}>
            <Text style={[workoutCardStyles.exerciseName, { color: palette.text }]}>
              {exerciseMeta.name}
            </Text>
            <Text style={[workoutCardStyles.exerciseType, { color: palette.muted }]}>
              ({exerciseMeta.equipment})
            </Text>
          </View>
          <View style={workoutCardStyles.exerciseHeaderActions}>
            <Pressable
              onPress={() => setShowSwapModal(true)}
              style={[
                workoutCardStyles.exerciseHeaderAction,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutCardStyles.exerciseHeaderActionText, { color: palette.accent }]}>
                swap
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowInfoModal(true)}
              style={[
                workoutCardStyles.exerciseHeaderAction,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutCardStyles.exerciseHeaderActionText, { color: palette.accent }]}>
                info
              </Text>
            </Pressable>
          </View>
        </View>

        {showRestBanner ? (
          <View
            style={[
              workoutCardStyles.restBanner,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            {restFinished ? (
              <Text style={[workoutCardStyles.restBannerGo, { color: palette.accent }]}>GO</Text>
            ) : (
              <>
                <Text style={[workoutCardStyles.restBannerLabel, { color: palette.accent }]}>Rest</Text>
                <Text style={[workoutCardStyles.restBannerValue, { color: palette.text }]}>
                  {formatClock(restRemainingSeconds)}
                </Text>
              </>
            )}
          </View>
        ) : null}

        <View style={[workoutCardStyles.tableWrap, { backgroundColor: palette.panel, borderColor: palette.line }]}>
          <View style={[workoutCardStyles.tableHeader, { backgroundColor: palette.card }]}>
            <View style={workoutCardStyles.setCol}>
              <Text style={[workoutCardStyles.tableHeaderText, { color: palette.muted }]}>Set</Text>
            </View>
            <View style={workoutCardStyles.previousCol}>
              <Text style={[workoutCardStyles.tableHeaderText, { color: palette.muted }]}>Suggested</Text>
            </View>
            <View style={workoutCardStyles.inputCol}>
              <Text style={[workoutCardStyles.tableHeaderText, { color: palette.muted }]}>Lb</Text>
            </View>
            <View style={workoutCardStyles.inputCol}>
              <Text style={[workoutCardStyles.tableHeaderText, { color: palette.muted }]}>Reps</Text>
            </View>
            <View style={workoutCardStyles.checkCol}>
              <Text style={[workoutCardStyles.tableHeaderText, { color: palette.muted }]}>Done</Text>
            </View>
          </View>

          {activeProgress.setProgress.map((setEntry, setIndex) => (
            <View
              key={`${activeExercise.exerciseId}-${setEntry.setNumber}`}
              style={[
                workoutCardStyles.setRow,
                { borderTopColor: palette.line, backgroundColor: palette.panel },
                setIndex === activeProgress.setProgress.findIndex((entry) => !entry.completed)
                  ? [workoutCardStyles.setRowActive, { borderLeftColor: palette.accent }]
                  : null,
                setEntry.completed ? workoutCardStyles.setRowCompleted : null,
              ]}
            >
              <View style={workoutCardStyles.setCol}>
                <Text style={[workoutCardStyles.setRowText, { color: palette.text }]}>
                  {setEntry.setNumber}
                </Text>
              </View>
              <View style={workoutCardStyles.previousCol}>
                <Text style={[workoutCardStyles.setPreviousText, { color: setEntry.completed ? palette.accent : palette.muted }]}>
                  {setEntry.suggestedWeight > 0
                    ? `${setEntry.suggestedWeight} lb x ${setEntry.suggestedReps}`
                    : `${setEntry.suggestedReps} reps`}
                </Text>
              </View>
              <View style={workoutCardStyles.inputCol}>
                <TextInput
                  value={setEntry.actualWeight}
                  onChangeText={(value) => updateWorkoutSetField(activeExerciseIndex, setIndex, 'actualWeight', value.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  editable={!setEntry.completed}
                  style={[
                    workoutCardStyles.setInput,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.line,
                      color: palette.text,
                    },
                  ]}
                />
              </View>
              <View style={workoutCardStyles.inputCol}>
                <TextInput
                  value={setEntry.actualReps}
                  onChangeText={(value) => updateWorkoutSetField(activeExerciseIndex, setIndex, 'actualReps', value.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  editable={!setEntry.completed}
                  style={[
                    workoutCardStyles.setInput,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.line,
                      color: palette.text,
                    },
                  ]}
                />
              </View>
              <View style={workoutCardStyles.checkCol}>
                <Pressable
                  onPress={() => completeWorkoutSet(activeExerciseIndex, setIndex)}
                  disabled={setEntry.completed}
                  style={[
                    workoutCardStyles.checkButton,
                    setEntry.completed
                      ? workoutCardStyles.completedCheckButton
                      : { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text
                    style={[
                      workoutCardStyles.checkButtonText,
                      setEntry.completed
                        ? workoutCardStyles.completedCheckText
                        : { color: palette.muted },
                    ]}
                  >
                    {setEntry.completed ? '✓' : '+'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <ActionButton label="+ Add Set" onPress={() => addWorkoutSet(activeExerciseIndex)} />

        <View style={workoutCardStyles.workoutActionRow}>
          <Pressable
            onPress={cancelWorkout}
            style={[
              workoutCardStyles.secondaryAction,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <Text style={[workoutCardStyles.secondaryActionText, { color: palette.text }]}>
              Cancel Workout
            </Text>
          </Pressable>
          <ActionButton label="Save Workout" onPress={saveWorkout} />
        </View>
      </View>

      {nextExercise ? (
        <Pressable
          onPress={() => setActiveExerciseIndex(activeExerciseIndex + 1)}
          style={[workoutCardStyles.nextCard, { backgroundColor: palette.card, borderColor: palette.line }]}
        >
          <View style={workoutCardStyles.nextCardTop}>
            <Text style={[workoutCardStyles.nextLabel, { color: palette.muted }]}>Next</Text>
            <Text style={[workoutCardStyles.nextHint, { color: palette.muted }]}>Open</Text>
          </View>
          <Text style={[workoutCardStyles.nextName, { color: palette.text }]}>
            {getExerciseMeta(nextExercise.exerciseId).name}
          </Text>
          <Text style={[workoutCardStyles.nextMeta, { color: palette.muted }]}>
            ({getExerciseMeta(nextExercise.exerciseId).equipment}) · {nextExercise.targetSets} sets
          </Text>
        </Pressable>
      ) : null}

      <ExerciseInfoModal
        exerciseId={activeExercise.exerciseId}
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onAlternativePress={(exerciseId) => {
          swapWorkoutExercise(activeExerciseIndex, exerciseId);
          setShowInfoModal(false);
        }}
      />

      <Modal animationType="fade" transparent visible={showSwapModal} onRequestClose={() => setShowSwapModal(false)}>
        <View style={workoutCardStyles.modalBackdrop}>
          <View style={[workoutCardStyles.modalCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <View style={workoutCardStyles.modalHeader}>
              <Text style={[workoutCardStyles.modalTitle, { color: palette.text }]}>Swap Exercise</Text>
              <Pressable
                onPress={() => setShowSwapModal(false)}
                style={[workoutCardStyles.modalClose, { backgroundColor: palette.panel, borderColor: palette.line }]}
              >
                <Text style={[workoutCardStyles.modalCloseText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <View style={workoutCardStyles.modalBody}>
              {exerciseMeta.alternatives.map((alternative) => (
                <Pressable
                  key={alternative.exerciseId}
                  onPress={() => {
                    swapWorkoutExercise(activeExerciseIndex, alternative.exerciseId);
                    setShowSwapModal(false);
                  }}
                  style={[workoutCardStyles.modalAlternativeCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
                >
                  <Text style={[workoutCardStyles.modalAlternativeTitle, { color: palette.text }]}>
                    {alternative.name}
                  </Text>
                  <Text style={[workoutCardStyles.modalAlternativeMeta, { color: palette.muted }]}>
                    {alternative.equipment}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={Boolean(pendingFeedback && feedbackTarget)} onRequestClose={() => respondToWorkoutFeedback(null)}>
        <View style={workoutCardStyles.modalBackdrop}>
          <View style={[workoutCardStyles.modalCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <View style={workoutCardStyles.modalHeader}>
              <Text style={[workoutCardStyles.modalTitle, { color: palette.text }]}>How did that set feel?</Text>
              <Pressable
                onPress={() => respondToWorkoutFeedback(null)}
                style={[workoutCardStyles.modalClose, { backgroundColor: palette.panel, borderColor: palette.line }]}
              >
                <Text style={[workoutCardStyles.modalCloseText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <Text style={[workoutCardStyles.feedbackPrompt, { color: palette.muted }]}>
              Could you have done a few more reps with good form if you had a spotter?
            </Text>

            <View style={workoutCardStyles.feedbackFooter}>
              {FEEDBACK_OPTIONS.map((option, index) => (
                <Pressable
                  key={option}
                  onPress={() => respondToWorkoutFeedback(index)}
                  style={[
                    workoutCardStyles.feedbackOption,
                    {
                      backgroundColor: index === 3 ? palette.accent : palette.panel,
                      borderColor: index === 3 ? palette.accentSoft : palette.line,
                    },
                  ]}
                >
                  <Text style={[workoutCardStyles.feedbackOptionIndex, { color: index === 3 ? palette.buttonText : palette.text }]}>
                    {index}
                  </Text>
                  <Text style={[workoutCardStyles.feedbackOptionText, { color: index === 3 ? palette.buttonText : palette.text }]}>
                    {option}
                  </Text>
                </Pressable>
              ))}

              <Pressable onPress={() => respondToWorkoutFeedback(null)}>
                <Text style={[workoutCardStyles.modalParagraph, workoutCardStyles.centeredText, { color: palette.muted }]}>
                  Skip
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
