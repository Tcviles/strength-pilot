import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { ExerciseInfoModal } from '../shared/ExerciseInfoModal';
import { WorkoutExercisePickerModal } from './WorkoutExercisePickerModal';

const FEEDBACK_OPTIONS = [
  'Not even close',
  'Probably not',
  'Maybe 1-2 more reps',
  'Maybe 3-4 more reps',
  'Definitely 5+ more reps',
];

const DELETE_WIDTH = 88;

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

type SwipeableSetRowProps = {
  canDelete: boolean;
  onDelete: () => void;
  children: React.ReactNode;
  errorColor: string;
};

function SwipeableSetRow({ canDelete, onDelete, children, errorColor }: SwipeableSetRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  const closeRow = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start(() => setOpen(false));
  };

  const openRow = () => {
    Animated.spring(translateX, {
      toValue: -DELETE_WIDTH,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start(() => setOpen(true));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        canDelete &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 12,
      onPanResponderMove: (_evt, gestureState) => {
        if (!canDelete) {
          return;
        }
        const nextX = Math.max(-DELETE_WIDTH, Math.min(0, gestureState.dx + (open ? -DELETE_WIDTH : 0)));
        translateX.setValue(nextX);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (!canDelete) {
          return;
        }
        const shouldOpen = open ? gestureState.dx < 24 : gestureState.dx < -32;
        if (shouldOpen) {
          openRow();
        } else {
          closeRow();
        }
      },
      onPanResponderTerminate: closeRow,
    }),
  ).current;

  return (
    <View style={exerciseCardStyles.setSwipeRowWrap}>
      {canDelete ? (
        <Pressable
          onPress={onDelete}
          style={[
            exerciseCardStyles.setDeleteAction,
            { backgroundColor: errorColor },
          ]}
        >
          <Text style={exerciseCardStyles.setDeleteActionText}>Delete</Text>
        </Pressable>
      ) : null}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...(canDelete ? panResponder.panHandlers : {})}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export function ExerciseCard() {
  const { palette } = useTheme();
  const {
    workout,
    activeExerciseIndex,
    restStartedAt,
    workoutProgress,
    pendingFeedback,
    updateWorkoutSetField,
    completeWorkoutSet,
    addWorkoutSet,
    insertWorkoutExercise,
    removeWorkoutSet,
    respondToWorkoutFeedback,
    swapWorkoutExercise,
  } = useAppState();
  const [now, setNow] = useState(Date.now());
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeExercise = workout?.exercises[activeExerciseIndex];
  const activeProgress = workoutProgress[activeExerciseIndex];
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
  const latestCompletedSet = activeProgress
    ? [...activeProgress.setProgress]
        .filter((setEntry) => setEntry.completed)
        .sort((a, b) => b.setNumber - a.setNumber)[0]
    : null;
  const showRestBanner = Boolean(latestCompletedSet && restStartedAt);

  if (!workout || !activeExercise || !activeProgress || !exerciseMeta) {
    return null;
  }

  return (
    <View style={[exerciseCardStyles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <View style={exerciseCardStyles.exerciseHeaderRow}>
        <View style={exerciseCardStyles.exerciseHeaderCopy}>
          <Text style={[exerciseCardStyles.exerciseName, { color: palette.text }]}>
            {exerciseMeta.displayName}
          </Text>
          <Text style={[exerciseCardStyles.exerciseSubline, { color: palette.muted }]}>
            {activeExercise.targetSets} sets
            {activeExercise.targetReps ? ` · ${activeExercise.targetReps} reps` : ''}
            {activeExercise.restSeconds ? ` · ${Math.round(activeExercise.restSeconds / 60)} min rest` : ''}
          </Text>
        </View>
        <View style={exerciseCardStyles.exerciseHeaderActions}>
          <Pressable
            onPress={() => setShowSwapModal(true)}
            style={[
              exerciseCardStyles.exerciseHeaderAction,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <Text style={[exerciseCardStyles.exerciseHeaderIconText, { color: palette.accent }]}>
              ⇄
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowInfoModal(true)}
            style={[
              exerciseCardStyles.exerciseHeaderAction,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <Text style={[exerciseCardStyles.exerciseHeaderIconText, { color: palette.accent }]}>
              i
            </Text>
          </Pressable>
        </View>
      </View>

      {showRestBanner ? (
        <View
          style={[
            exerciseCardStyles.restBanner,
            { backgroundColor: palette.panel, borderColor: palette.line },
          ]}
        >
          {restFinished ? (
            <Text style={[exerciseCardStyles.restBannerGo, { color: palette.accent }]}>GO</Text>
          ) : (
            <>
              <Text style={[exerciseCardStyles.restBannerLabel, { color: palette.accent }]}>Rest</Text>
              <Text style={[exerciseCardStyles.restBannerValue, { color: palette.text }]}>
                {formatClock(restRemainingSeconds)}
              </Text>
            </>
          )}
        </View>
      ) : null}

      <View style={[exerciseCardStyles.tableWrap, { backgroundColor: palette.panel, borderColor: palette.line }]}>
        <View style={[exerciseCardStyles.tableHeader, { backgroundColor: palette.card }]}>
          <View style={exerciseCardStyles.setCol}>
            <Text style={[exerciseCardStyles.tableHeaderText, { color: palette.muted }]}>Set</Text>
          </View>
          <View style={exerciseCardStyles.previousCol}>
            <Text style={[exerciseCardStyles.tableHeaderText, { color: palette.muted }]}>Suggested</Text>
          </View>
          <View style={exerciseCardStyles.inputCol}>
            <Text style={[exerciseCardStyles.tableHeaderText, { color: palette.muted }]}>Lb</Text>
          </View>
          <View style={exerciseCardStyles.inputCol}>
            <Text style={[exerciseCardStyles.tableHeaderText, { color: palette.muted }]}>Reps</Text>
          </View>
          <View style={exerciseCardStyles.checkCol}>
            <Text style={[exerciseCardStyles.tableHeaderText, { color: palette.muted }]}>Done</Text>
          </View>
        </View>

        {activeProgress.setProgress.map((setEntry, setIndex) => (
          <SwipeableSetRow
            key={`${activeExercise.exerciseId}-${setEntry.setNumber}`}
            canDelete={activeProgress.setProgress.length > 1}
            onDelete={() => removeWorkoutSet(activeExerciseIndex, setIndex)}
            errorColor={palette.error}
          >
            <View
              style={[
                exerciseCardStyles.setRow,
                { borderTopColor: palette.line, backgroundColor: palette.panel },
                setIndex === activeProgress.setProgress.findIndex((entry) => !entry.completed)
                  ? [exerciseCardStyles.setRowActive, { borderLeftColor: palette.accent }]
                  : null,
                setEntry.completed ? exerciseCardStyles.setRowCompleted : null,
              ]}
            >
              <View style={exerciseCardStyles.setCol}>
                <Text style={[exerciseCardStyles.setRowText, { color: palette.text }]}>
                  {setEntry.setNumber}
                </Text>
              </View>
              <View style={exerciseCardStyles.previousCol}>
                <Text style={[exerciseCardStyles.setPreviousText, { color: setEntry.completed ? palette.accent : palette.muted }]}>
                  {setEntry.suggestedWeight > 0
                    ? `${setEntry.suggestedWeight} lb x ${setEntry.suggestedReps}`
                    : `${setEntry.suggestedReps} reps`}
                </Text>
              </View>
              <View style={exerciseCardStyles.inputCol}>
                <TextInput
                  value={setEntry.actualWeight}
                  onChangeText={(value) => updateWorkoutSetField(activeExerciseIndex, setIndex, 'actualWeight', value.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  editable
                  style={[
                    exerciseCardStyles.setInput,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.line,
                      color: palette.text,
                    },
                  ]}
                />
              </View>
              <View style={exerciseCardStyles.inputCol}>
                <TextInput
                  value={setEntry.actualReps}
                  onChangeText={(value) => updateWorkoutSetField(activeExerciseIndex, setIndex, 'actualReps', value.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  editable
                  style={[
                    exerciseCardStyles.setInput,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.line,
                      color: palette.text,
                    },
                  ]}
                />
              </View>
              <View style={exerciseCardStyles.checkCol}>
                <Pressable
                  onPress={() => completeWorkoutSet(activeExerciseIndex, setIndex)}
                  style={[
                    exerciseCardStyles.checkButton,
                    setEntry.completed
                      ? exerciseCardStyles.completedCheckButton
                      : { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text
                    style={[
                      exerciseCardStyles.checkButtonText,
                      setEntry.completed
                        ? exerciseCardStyles.completedCheckText
                        : { color: palette.muted },
                    ]}
                  >
                    {setEntry.completed ? '✓' : '+'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </SwipeableSetRow>
        ))}
      </View>

      <ActionButton label="+ Add Set" onPress={() => addWorkoutSet(activeExerciseIndex)} />

      <Pressable
        onPress={() => setShowAddExerciseModal(true)}
        style={[
          exerciseCardStyles.addExerciseButton,
          { backgroundColor: palette.panel, borderColor: palette.accentSoft },
        ]}
      >
        <Text style={[exerciseCardStyles.addExerciseButtonText, { color: palette.accent }]}>
          + Add Exercise
        </Text>
      </Pressable>

      <ExerciseInfoModal
        exerciseId={activeExercise.exerciseId}
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        onVariantPress={(exerciseId) => {
          swapWorkoutExercise(activeExerciseIndex, exerciseId);
          setShowInfoModal(false);
        }}
        onAlternativePress={(exerciseId) => {
          swapWorkoutExercise(activeExerciseIndex, exerciseId);
          setShowInfoModal(false);
        }}
      />

      <WorkoutExercisePickerModal
        visible={showAddExerciseModal}
        title="Add Next Exercise"
        onClose={() => setShowAddExerciseModal(false)}
        onSelect={(exerciseId) => insertWorkoutExercise(activeExerciseIndex + 1, exerciseId)}
      />

      <Modal animationType="fade" transparent visible={showSwapModal} onRequestClose={() => setShowSwapModal(false)}>
        <View style={exerciseCardStyles.modalBackdrop}>
          <View style={[exerciseCardStyles.modalCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <View style={exerciseCardStyles.modalHeader}>
              <Text style={[exerciseCardStyles.modalTitle, { color: palette.text }]}>Swap Exercise</Text>
              <Pressable
                onPress={() => setShowSwapModal(false)}
                style={[exerciseCardStyles.modalClose, { backgroundColor: palette.panel, borderColor: palette.line }]}
              >
                <Text style={[exerciseCardStyles.modalCloseText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <View style={exerciseCardStyles.modalBody}>
              {exerciseMeta.alternatives.map((alternative) => (
                <Pressable
                  key={alternative.exerciseId}
                  onPress={() => {
                    swapWorkoutExercise(activeExerciseIndex, alternative.exerciseId);
                    setShowSwapModal(false);
                  }}
                  style={[exerciseCardStyles.modalAlternativeCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
                >
                  <Text style={[exerciseCardStyles.modalAlternativeTitle, { color: palette.text }]}>
                    {alternative.displayName || alternative.name}
                  </Text>
                  <Text style={[exerciseCardStyles.modalAlternativeMeta, { color: palette.muted }]}>
                    {alternative.equipment}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={Boolean(pendingFeedback && feedbackTarget)} onRequestClose={() => respondToWorkoutFeedback(null)}>
        <View style={exerciseCardStyles.modalBackdrop}>
          <View style={[exerciseCardStyles.modalCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
            <View style={exerciseCardStyles.modalHeader}>
              <Text style={[exerciseCardStyles.modalTitle, { color: palette.text }]}>How did that set feel?</Text>
              <Pressable
                onPress={() => respondToWorkoutFeedback(null)}
                style={[exerciseCardStyles.modalClose, { backgroundColor: palette.panel, borderColor: palette.line }]}
              >
                <Text style={[exerciseCardStyles.modalCloseText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <Text style={[exerciseCardStyles.feedbackPrompt, { color: palette.muted }]}>
              Could you have done a few more reps with good form if you had a spotter?
            </Text>

            <View style={exerciseCardStyles.feedbackFooter}>
              {FEEDBACK_OPTIONS.map((option, index) => (
                <Pressable
                  key={option}
                  onPress={() => respondToWorkoutFeedback(index)}
                  style={[
                    exerciseCardStyles.feedbackOption,
                    {
                      backgroundColor: index === 3 ? palette.accent : palette.panel,
                      borderColor: index === 3 ? palette.accentSoft : palette.line,
                    },
                  ]}
                >
                  <Text style={[exerciseCardStyles.feedbackOptionIndex, { color: index === 3 ? palette.buttonText : palette.text }]}>
                    {index}
                  </Text>
                  <Text style={[exerciseCardStyles.feedbackOptionText, { color: index === 3 ? palette.buttonText : palette.text }]}>
                    {option}
                  </Text>
                </Pressable>
              ))}

              <Pressable onPress={() => respondToWorkoutFeedback(null)}>
                <Text style={[exerciseCardStyles.modalParagraph, exerciseCardStyles.centeredText, { color: palette.muted }]}>
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

const exerciseCardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  exerciseHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  exerciseSubline: {
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  exerciseHeaderAction: {
    borderWidth: 1,
    borderRadius: 12,
    minWidth: 54,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  exerciseHeaderIconText: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 18,
    textTransform: 'none',
  },
  restBanner: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  restBannerLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  restBannerValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  restBannerGo: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  completedCheckButton: {
    backgroundColor: '#173222',
    borderColor: '#67b77c',
  },
  completedCheckText: {
    color: '#9be2aa',
  },
  tableWrap: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  setCol: {
    width: 44,
  },
  previousCol: {
    flex: 1.2,
  },
  inputCol: {
    flex: 0.9,
  },
  checkCol: {
    width: 54,
    alignItems: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  setSwipeRowWrap: {
    overflow: 'hidden',
  },
  setDeleteAction: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDeleteActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  setRowActive: {
    borderLeftWidth: 2,
  },
  setRowCompleted: {
    opacity: 1,
  },
  setRowText: {
    fontSize: 18,
    fontWeight: '700',
  },
  setPreviousText: {
    fontSize: 14,
    fontWeight: '600',
  },
  setInput: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  checkButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 12, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  modalClose: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    gap: 12,
  },
  modalParagraph: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  centeredText: {
    textAlign: 'center',
  },
  modalAlternativeCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  modalAlternativeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalAlternativeMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  feedbackPrompt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  feedbackOption: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  feedbackOptionIndex: {
    width: 26,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  feedbackOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackFooter: {
    gap: 10,
  },
  addExerciseButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  addExerciseButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
