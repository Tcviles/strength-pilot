import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { WorkoutTemplateEditor } from './WorkoutTemplateEditor';

export function WorkoutPreviewCard() {
  const { palette } = useTheme();
  const {
    workout,
    focus,
    loading,
    startWorkout,
    cancelWorkout,
  } = useAppState();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (workout && workout.exercises.length === 0) {
      setEditOpen(true);
    }
  }, [workout]);

  if (!workout) {
    return null;
  }

  const estimatedTime = `${workout.durationMinutes} min`;
  const exerciseCount = workout.exercises.length;

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
                      {meta.displayName}
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
              grow
              label={loading ? 'Preparing...' : 'Start Workout'}
              disabled={loading || workout.exercises.length === 0}
              onPress={() => startWorkout().catch(() => undefined)}
            />
          </View>
        </View>
      </View>

      <Modal animationType="fade" transparent visible={editOpen} onRequestClose={() => setEditOpen(false)}>
        <View style={workoutPreviewCardStyles.modalBackdrop}>
          <WorkoutTemplateEditor
            variant="preview"
            title="Edit Workout"
            subtitle="Reorder, trim, and add exercises before you start."
            onClose={() => setEditOpen(false)}
            footer={(
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
                <ActionButton grow label="Save Changes" onPress={() => setEditOpen(false)} />
              </View>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const workoutPreviewCardStyles = StyleSheet.create({
  screen: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  listWrap: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  firstRow: {
    borderTopWidth: 0,
  },
  rowIndex: {
    width: 18,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  rowMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  rowHandle: {
    fontSize: 18,
    fontWeight: '700',
  },
  rowHandleButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 12, 0.78)',
    justifyContent: 'center',
    padding: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
});
