import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { WorkoutExercisePickerModal } from './WorkoutExercisePickerModal';

const DELETE_WIDTH = 88;

type Variant = 'preview' | 'workout';

type WorkoutTemplateEditorProps = {
  variant: Variant;
  title: string;
  subtitle?: string;
  onClose?: () => void;
  footer?: React.ReactNode;
};

type SwipeRowProps = {
  variant: Variant;
  index: number;
  title: string;
  meta: string;
  targetSets: number;
  current: boolean;
  completed: boolean;
  canDelete: boolean;
  onPress?: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDecreaseSets: () => void;
  onIncreaseSets: () => void;
};

function SwipeDeleteRow({
  variant,
  index,
  title,
  meta,
  targetSets,
  current,
  completed,
  canDelete,
  onPress,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDecreaseSets,
  onIncreaseSets,
}: SwipeRowProps) {
  const { palette } = useTheme();
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
    <View style={workoutTemplateEditorStyles.swipeRowWrap}>
      {canDelete ? (
        <Pressable
          onPress={onDelete}
          style={[
            workoutTemplateEditorStyles.deleteAction,
            { backgroundColor: palette.error },
          ]}
        >
          <Text style={workoutTemplateEditorStyles.deleteActionText}>Delete</Text>
        </Pressable>
      ) : null}
      <Animated.View
        style={[
          workoutTemplateEditorStyles.exerciseRow,
          {
            backgroundColor: palette.panel,
            borderColor: palette.line,
            transform: [{ translateX }],
          },
        ]}
        {...(canDelete ? panResponder.panHandlers : {})}
      >
        <Pressable
          onPress={
            open
              ? closeRow
              : () => {
                onPress?.();
              }
          }
          style={[
            workoutTemplateEditorStyles.exerciseRowPressable,
            variant === 'preview' ? workoutTemplateEditorStyles.exerciseRowPressablePreview : null,
          ]}
        >
          <View style={workoutTemplateEditorStyles.exerciseRowTop}>
            <View style={workoutTemplateEditorStyles.exerciseRowIndexWrap}>
              <Text
                style={[
                  workoutTemplateEditorStyles.exerciseRowIndex,
                  { color: current ? palette.accent : palette.muted },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <View style={workoutTemplateEditorStyles.exerciseRowCopy}>
              <Text style={[workoutTemplateEditorStyles.exerciseRowTitle, { color: palette.text }]}>
                {title}
              </Text>
              <Text style={[workoutTemplateEditorStyles.exerciseRowMeta, { color: palette.muted }]}>
                {meta}
              </Text>
            </View>
            {variant === 'workout' ? (
              <View style={workoutTemplateEditorStyles.exerciseRowActions}>
                <View
                  style={[
                    workoutTemplateEditorStyles.exerciseRowStatus,
                    current
                      ? { borderColor: palette.accent, backgroundColor: palette.card }
                      : { borderColor: palette.line, backgroundColor: palette.card },
                    completed ? workoutTemplateEditorStyles.exerciseRowStatusCompleted : null,
                  ]}
                >
                  <Text
                    style={[
                      workoutTemplateEditorStyles.exerciseRowStatusText,
                      { color: current ? palette.accent : completed ? '#9be2aa' : palette.muted },
                    ]}
                  >
                    {current ? '▶' : completed ? '✓' : '○'}
                  </Text>
                </View>
                <Text style={[workoutTemplateEditorStyles.exerciseRowHandle, { color: palette.muted }]}>≡</Text>
              </View>
            ) : (
              <View style={workoutTemplateEditorStyles.previewActionRow}>
                <Pressable
                  onPress={onMoveUp}
                  style={[
                    workoutTemplateEditorStyles.iconAction,
                    { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text style={[workoutTemplateEditorStyles.iconActionText, { color: palette.text }]}>↑</Text>
                </Pressable>
                <Pressable
                  onPress={onMoveDown}
                  style={[
                    workoutTemplateEditorStyles.iconAction,
                    { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text style={[workoutTemplateEditorStyles.iconActionText, { color: palette.text }]}>↓</Text>
                </Pressable>
              </View>
            )}
          </View>
          {variant === 'preview' ? (
            <View style={workoutTemplateEditorStyles.setStepperRow}>
              <Text style={[workoutTemplateEditorStyles.setStepperLabel, { color: palette.text }]}>
                Target Sets
              </Text>
              <View style={workoutTemplateEditorStyles.setStepper}>
                <Pressable
                  onPress={onDecreaseSets}
                  style={[
                    workoutTemplateEditorStyles.setStepperButton,
                    { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text style={[workoutTemplateEditorStyles.setStepperButtonText, { color: palette.text }]}>−</Text>
                </Pressable>
                <Text style={[workoutTemplateEditorStyles.setStepperValue, { color: palette.text }]}>
                  {targetSets}
                </Text>
                <Pressable
                  onPress={onIncreaseSets}
                  style={[
                    workoutTemplateEditorStyles.setStepperButton,
                    { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text style={[workoutTemplateEditorStyles.setStepperButtonText, { color: palette.text }]}>+</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function WorkoutTemplateEditor({
  variant,
  title,
  subtitle,
  onClose,
  footer,
}: WorkoutTemplateEditorProps) {
  const { palette } = useTheme();
  const {
    workout,
    focus,
    activeExerciseIndex,
    workoutProgress,
    setActiveExerciseIndex,
    moveWorkoutExercise,
    updateWorkoutExerciseTargetSets,
    removeWorkoutExercise,
    insertWorkoutExercise,
  } = useAppState();
  const [showAddExercise, setShowAddExercise] = useState(false);

  if (!workout) {
    return null;
  }

  const isWorkoutVariant = variant === 'workout';

  return (
    <>
      <View
        style={[
          workoutTemplateEditorStyles.card,
          isWorkoutVariant
            ? workoutTemplateEditorStyles.compactCard
            : workoutTemplateEditorStyles.previewCard,
          { backgroundColor: palette.card, borderColor: palette.line },
        ]}
      >
        <View style={workoutTemplateEditorStyles.header}>
          <View style={workoutTemplateEditorStyles.headerCopy}>
            <Text style={[workoutTemplateEditorStyles.eyebrow, { color: palette.accent }]}>
              {focus.toUpperCase()} SESSION
            </Text>
            <Text style={[workoutTemplateEditorStyles.title, { color: palette.text }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[workoutTemplateEditorStyles.subtitle, { color: palette.muted }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {onClose ? (
            <Pressable
              onPress={onClose}
              style={[
                workoutTemplateEditorStyles.closeButton,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutTemplateEditorStyles.closeButtonText, { color: palette.text }]}>×</Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          persistentScrollbar={false}
          contentContainerStyle={workoutTemplateEditorStyles.listContent}
        >
          {workout.exercises.map((exercise, index) => {
            const meta = getExerciseMeta(exercise.exerciseId);
            const progress = workoutProgress[index];
            const completed = Boolean(progress && progress.setProgress.every((setEntry) => setEntry.completed));

            return (
              <SwipeDeleteRow
                key={`${exercise.exerciseId}-${index}`}
                variant={variant}
                index={index}
                title={meta.displayName}
                meta={`${exercise.targetSets} sets · ${exercise.targetReps} reps`}
                targetSets={exercise.targetSets}
                current={index === activeExerciseIndex}
                completed={completed}
                canDelete={workout.exercises.length > 1}
                onPress={
                  isWorkoutVariant
                    ? () => {
                      setActiveExerciseIndex(index);
                      onClose?.();
                    }
                    : undefined
                }
                onDelete={() => removeWorkoutExercise(index)}
                onMoveUp={() => moveWorkoutExercise(index, 'up')}
                onMoveDown={() => moveWorkoutExercise(index, 'down')}
                onDecreaseSets={() => updateWorkoutExerciseTargetSets(index, exercise.targetSets - 1)}
                onIncreaseSets={() => updateWorkoutExerciseTargetSets(index, exercise.targetSets + 1)}
              />
            );
          })}
        </ScrollView>

        <Pressable
          onPress={() => {
            setShowAddExercise(true);
          }}
          style={[
            workoutTemplateEditorStyles.addButton,
            { backgroundColor: palette.panel, borderColor: palette.accentSoft },
          ]}
        >
          <Text style={[workoutTemplateEditorStyles.addButtonText, { color: palette.accent }]}>
            + Add Exercise
          </Text>
        </Pressable>

        {isWorkoutVariant ? (
          <View style={workoutTemplateEditorStyles.legendRow}>
            <View style={workoutTemplateEditorStyles.legendItem}>
              <Text style={[workoutTemplateEditorStyles.legendIcon, workoutTemplateEditorStyles.legendIconCompleted]}>✓</Text>
              <Text style={[workoutTemplateEditorStyles.legendText, { color: palette.muted }]}>Completed</Text>
            </View>
            <View style={workoutTemplateEditorStyles.legendItem}>
              <Text style={[workoutTemplateEditorStyles.legendIcon, { color: palette.accent }]}>▶</Text>
              <Text style={[workoutTemplateEditorStyles.legendText, { color: palette.muted }]}>Current</Text>
            </View>
          </View>
        ) : null}

        {footer}
      </View>

      <WorkoutExercisePickerModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onSelect={(exerciseId) => insertWorkoutExercise(activeExerciseIndex + 1, exerciseId)}
      />
    </>
  );
}

const workoutTemplateEditorStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  compactCard: {
    maxHeight: '72%',
  },
  previewCard: {
    maxHeight: '92%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 12, 0.78)',
    justifyContent: 'center',
    padding: 18,
  },
  addModalCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
    maxHeight: '76%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 17,
    fontWeight: '800',
  },
  listContent: {
    gap: 8,
  },
  swipeRowWrap: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  deleteAction: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  exerciseRow: {
    borderWidth: 1,
    borderRadius: 16,
  },
  exerciseRowPressable: {
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  exerciseRowPressablePreview: {
    alignItems: 'stretch',
  },
  exerciseRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseRowIndexWrap: {
    width: 20,
  },
  exerciseRowIndex: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  exerciseRowCopy: {
    flex: 1,
    gap: 4,
  },
  exerciseRowTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  exerciseRowMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  exerciseRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseRowStatus: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseRowStatusCompleted: {
    backgroundColor: '#173222',
    borderColor: '#67b77c',
  },
  exerciseRowStatusText: {
    fontSize: 16,
    fontWeight: '800',
  },
  exerciseRowHandle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconAction: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  setStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  setStepperLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  setStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setStepperButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setStepperButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  setStepperValue: {
    minWidth: 24,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  addButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIcon: {
    fontSize: 14,
    fontWeight: '800',
  },
  legendIconCompleted: {
    color: '#9be2aa',
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  choiceRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  choiceCopy: {
    flex: 1,
    gap: 4,
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  choiceMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  choiceButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
