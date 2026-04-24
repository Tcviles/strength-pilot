import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getExerciseLibraryItems, getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { workoutPreviewCardStyles } from './WorkoutPreviewCard.styles';

export function WorkoutPreviewCard() {
  const { palette } = useTheme();
  const {
    workout,
    focus,
    loading,
    startWorkout,
    cancelWorkout,
    moveWorkoutExercise,
    updateWorkoutExerciseTargetSets,
    removeWorkoutExercise,
    insertWorkoutExercise,
  } = useAppState();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const exerciseChoices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return getExerciseLibraryItems().filter((exercise) => {
      if (!query) {
        return true;
      }

      return (
        exercise.name.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query) ||
        exercise.primaryMuscles.join(' ').toLowerCase().includes(query)
      );
    });
  }, [search]);

  if (!workout) {
    return null;
  }

  const estimatedTime = `${workout.durationMinutes} min`;
  const exerciseCount = workout.exercises.length;

  const handleOpenInsert = (targetIndex: number) => {
    setInsertIndex(targetIndex);
    setSearch('');
    setAddOpen(true);
  };

  const handleAddExercise = (exerciseId: string) => {
    insertWorkoutExercise(insertIndex ?? workout.exercises.length, exerciseId);
    setAddOpen(false);
    setInsertIndex(null);
    setSearch('');
  };

  return (
    <>
      <View style={workoutPreviewCardStyles.screen}>
        <View
          style={[
            workoutPreviewCardStyles.card,
            { backgroundColor: palette.card, borderColor: palette.line },
          ]}
        >
          <View style={workoutPreviewCardStyles.headerRow}>
            <View style={workoutPreviewCardStyles.headerCopy}>
              <Text style={[workoutPreviewCardStyles.eyebrow, { color: palette.accent }]}>
                {focus.toUpperCase()} SESSION
              </Text>
              <Text style={[workoutPreviewCardStyles.title, { color: palette.text }]}>
                Preview Workout
              </Text>
              <Text style={[workoutPreviewCardStyles.subtitle, { color: palette.muted }]}>
                Review, customize, and build the workout before you start.
              </Text>
            </View>
            <Pressable
              onPress={() => setEditOpen(true)}
              style={[
                workoutPreviewCardStyles.editButton,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.editButtonText, { color: palette.text }]}>Edit</Text>
            </Pressable>
          </View>

          <View style={workoutPreviewCardStyles.statsRow}>
            <View
              style={[
                workoutPreviewCardStyles.statCard,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.statLabel, { color: palette.muted }]}>Estimated Time</Text>
              <Text style={[workoutPreviewCardStyles.statValue, { color: palette.text }]}>{estimatedTime}</Text>
            </View>
            <View
              style={[
                workoutPreviewCardStyles.statCard,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.statLabel, { color: palette.muted }]}>Exercises</Text>
              <Text style={[workoutPreviewCardStyles.statValue, { color: palette.text }]}>{exerciseCount}</Text>
            </View>
          </View>

          <View
            style={[
              workoutPreviewCardStyles.listWrap,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            {workout.exercises.map((exercise, index) => {
              const meta = getExerciseMeta(exercise.exerciseId);
              return (
                <View
                  key={`${exercise.exerciseId}-${index}`}
                  style={[
                    workoutPreviewCardStyles.row,
                    { borderTopColor: palette.line },
                    index === 0 ? workoutPreviewCardStyles.firstRow : null,
                  ]}
                >
                  <Text style={[workoutPreviewCardStyles.rowIndex, { color: palette.muted }]}>
                    {index + 1}
                  </Text>
                  <View style={workoutPreviewCardStyles.rowCopy}>
                    <Text style={[workoutPreviewCardStyles.rowTitle, { color: palette.text }]}>
                      {meta.name}
                    </Text>
                    <Text style={[workoutPreviewCardStyles.rowMeta, { color: palette.muted }]}>
                      {meta.equipment} · {exercise.targetSets} sets
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setEditOpen(true)}
                    style={workoutPreviewCardStyles.rowHandleButton}
                  >
                    <Text style={[workoutPreviewCardStyles.rowHandle, { color: palette.muted }]}>≡</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={workoutPreviewCardStyles.footerRow}>
            <Pressable
              onPress={cancelWorkout}
              style={[
                workoutPreviewCardStyles.secondaryAction,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.secondaryActionText, { color: palette.text }]}>
                Cancel
              </Text>
            </Pressable>
            <ActionButton
              label={loading ? 'Preparing...' : 'Start Workout'}
              disabled={loading}
              onPress={() => startWorkout().catch(() => undefined)}
            />
          </View>
        </View>
      </View>

      <Modal animationType="fade" transparent visible={editOpen} onRequestClose={() => setEditOpen(false)}>
        <View style={workoutPreviewCardStyles.modalBackdrop}>
          <View
            style={[
              workoutPreviewCardStyles.modalCard,
              { backgroundColor: palette.card, borderColor: palette.line },
            ]}
          >
            <View style={workoutPreviewCardStyles.modalHeader}>
              <Text style={[workoutPreviewCardStyles.modalTitle, { color: palette.text }]}>
                Edit Workout
              </Text>
              <Pressable
                onPress={() => setEditOpen(false)}
                style={[
                  workoutPreviewCardStyles.closeButton,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <Text style={[workoutPreviewCardStyles.closeButtonText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <Text style={[workoutPreviewCardStyles.modalHint, { color: palette.muted }]}>
              Reorder exercises, adjust set targets, or insert a movement that fits your strategy.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={workoutPreviewCardStyles.modalList}>
              <Pressable
                onPress={() => handleOpenInsert(0)}
                style={[
                  workoutPreviewCardStyles.insertButton,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <Text style={[workoutPreviewCardStyles.insertButtonText, { color: palette.accent }]}>
                  Insert exercise at top
                </Text>
              </Pressable>

              {workout.exercises.map((exercise, index) => {
                const meta = getExerciseMeta(exercise.exerciseId);
                return (
                  <React.Fragment key={`${exercise.exerciseId}-${index}-edit`}>
                    <View
                      style={[
                        workoutPreviewCardStyles.editRow,
                        { backgroundColor: palette.panel, borderColor: palette.line },
                      ]}
                    >
                      <View style={workoutPreviewCardStyles.editRowTop}>
                        <Text style={[workoutPreviewCardStyles.editRowNumber, { color: palette.muted }]}>
                          {index + 1}
                        </Text>
                        <View style={workoutPreviewCardStyles.editRowCopy}>
                          <Text style={[workoutPreviewCardStyles.editRowTitle, { color: palette.text }]}>
                            {meta.name}
                          </Text>
                          <Text style={[workoutPreviewCardStyles.editRowMeta, { color: palette.muted }]}>
                            {meta.equipment} · {exercise.targetReps} reps
                          </Text>
                        </View>
                        <View style={workoutPreviewCardStyles.editRowActions}>
                          <Pressable
                            onPress={() => moveWorkoutExercise(index, 'up')}
                            style={[
                              workoutPreviewCardStyles.iconAction,
                              { backgroundColor: palette.card, borderColor: palette.line },
                            ]}
                          >
                            <Text style={[workoutPreviewCardStyles.iconActionText, { color: palette.text }]}>↑</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => moveWorkoutExercise(index, 'down')}
                            style={[
                              workoutPreviewCardStyles.iconAction,
                              { backgroundColor: palette.card, borderColor: palette.line },
                            ]}
                          >
                            <Text style={[workoutPreviewCardStyles.iconActionText, { color: palette.text }]}>↓</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => removeWorkoutExercise(index)}
                            style={[
                              workoutPreviewCardStyles.iconAction,
                              { backgroundColor: palette.card, borderColor: palette.line },
                            ]}
                          >
                            <Text style={[workoutPreviewCardStyles.iconActionText, { color: palette.accent }]}>×</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={workoutPreviewCardStyles.setStepperRow}>
                        <Text style={[workoutPreviewCardStyles.setStepperLabel, { color: palette.text }]}>
                          Target Sets
                        </Text>
                        <View style={workoutPreviewCardStyles.setStepper}>
                          <Pressable
                            onPress={() => updateWorkoutExerciseTargetSets(index, exercise.targetSets - 1)}
                            style={[
                              workoutPreviewCardStyles.setStepperButton,
                              { backgroundColor: palette.card, borderColor: palette.line },
                            ]}
                          >
                            <Text style={[workoutPreviewCardStyles.setStepperButtonText, { color: palette.text }]}>−</Text>
                          </Pressable>
                          <Text style={[workoutPreviewCardStyles.setStepperValue, { color: palette.text }]}>
                            {exercise.targetSets}
                          </Text>
                          <Pressable
                            onPress={() => updateWorkoutExerciseTargetSets(index, exercise.targetSets + 1)}
                            style={[
                              workoutPreviewCardStyles.setStepperButton,
                              { backgroundColor: palette.card, borderColor: palette.line },
                            ]}
                          >
                            <Text style={[workoutPreviewCardStyles.setStepperButtonText, { color: palette.text }]}>+</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => handleOpenInsert(index + 1)}
                      style={[
                        workoutPreviewCardStyles.insertButton,
                        { backgroundColor: palette.panel, borderColor: palette.line },
                      ]}
                    >
                      <Text style={[workoutPreviewCardStyles.insertButtonText, { color: palette.accent }]}>
                        Insert here
                      </Text>
                    </Pressable>
                  </React.Fragment>
                );
              })}
            </ScrollView>

            <View style={workoutPreviewCardStyles.modalFooter}>
              <Pressable
                onPress={cancelWorkout}
                style={[
                  workoutPreviewCardStyles.secondaryAction,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <Text style={[workoutPreviewCardStyles.secondaryActionText, { color: palette.text }]}>
                  Clear All
                </Text>
              </Pressable>
              <ActionButton label="Save Changes" onPress={() => setEditOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={addOpen} onRequestClose={() => setAddOpen(false)}>
        <View style={workoutPreviewCardStyles.modalBackdrop}>
          <View
            style={[
              workoutPreviewCardStyles.modalCard,
              { backgroundColor: palette.card, borderColor: palette.line },
            ]}
          >
            <View style={workoutPreviewCardStyles.modalHeader}>
              <Text style={[workoutPreviewCardStyles.modalTitle, { color: palette.text }]}>
                Add Exercise
              </Text>
              <Pressable
                onPress={() => setAddOpen(false)}
                style={[
                  workoutPreviewCardStyles.closeButton,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <Text style={[workoutPreviewCardStyles.closeButtonText, { color: palette.text }]}>x</Text>
              </Pressable>
            </View>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search exercises"
              placeholderTextColor={palette.placeholder}
              style={[
                workoutPreviewCardStyles.searchInput,
                { backgroundColor: palette.panel, borderColor: palette.line, color: palette.text },
              ]}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={workoutPreviewCardStyles.modalList}>
              {exerciseChoices.map((exercise) => (
                <Pressable
                  key={exercise.exerciseId}
                  onPress={() => handleAddExercise(exercise.exerciseId)}
                  style={[
                    workoutPreviewCardStyles.exerciseChoice,
                    { backgroundColor: palette.panel, borderColor: palette.line },
                  ]}
                >
                  <View style={workoutPreviewCardStyles.exerciseChoiceCopy}>
                    <Text style={[workoutPreviewCardStyles.exerciseChoiceTitle, { color: palette.text }]}>
                      {exercise.name}
                    </Text>
                    <Text style={[workoutPreviewCardStyles.exerciseChoiceMeta, { color: palette.muted }]}>
                      {exercise.equipment}
                    </Text>
                  </View>
                  <View
                    style={[
                      workoutPreviewCardStyles.exerciseChoiceButton,
                      { backgroundColor: palette.card, borderColor: palette.line },
                    ]}
                  >
                    <Text style={[workoutPreviewCardStyles.exerciseChoiceButtonText, { color: palette.accent }]}>+</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
