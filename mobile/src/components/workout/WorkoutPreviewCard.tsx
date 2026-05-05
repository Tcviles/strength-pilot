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
import { chrome } from '../../theme/styles';
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
            { backgroundColor: palette.panel, borderColor: palette.line },
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
                { backgroundColor: palette.card, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.statLabel, { color: palette.muted }]}>Estimated Time</Text>
              <Text style={[workoutPreviewCardStyles.statValue, { color: palette.text }]}>{estimatedTime}</Text>
            </View>
            <View
              style={[
                workoutPreviewCardStyles.statCard,
                { backgroundColor: palette.card, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutPreviewCardStyles.statLabel, { color: palette.muted }]}>Exercises</Text>
              <Text style={[workoutPreviewCardStyles.statValue, { color: palette.text }]}>{exerciseCount}</Text>
            </View>
          </View>

          <View
            style={[
              workoutPreviewCardStyles.listWrap,
              { backgroundColor: palette.card, borderColor: palette.line },
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
                { backgroundColor: palette.card, borderColor: palette.line },
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
    gap: chrome.sectionGap,
  },
  card: {
    borderWidth: 1,
    borderRadius: chrome.cardRadius,
    padding: chrome.panelPadding,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: chrome.eyebrowFontSize,
    fontWeight: '700',
    letterSpacing: chrome.eyebrowLetterSpacing,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: chrome.metaFontSize,
    lineHeight: 17,
    fontWeight: '500',
    opacity: chrome.metaOpacity,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: chrome.buttonRadius,
    minHeight: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: chrome.rowRadius,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    opacity: chrome.metaOpacity,
  },
  statValue: {
    fontSize: 21,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  listWrap: {
    borderRadius: chrome.cardRadius,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 11,
    borderTopWidth: 1,
  },
  firstRow: {
    borderTopWidth: 0,
  },
  rowIndex: {
    width: 22,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  rowMeta: {
    fontSize: chrome.metaFontSize,
    lineHeight: chrome.metaLineHeight,
    fontWeight: '500',
    opacity: chrome.metaOpacity,
  },
  rowHandle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.72,
  },
  rowHandleButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: chrome.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '700',
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
