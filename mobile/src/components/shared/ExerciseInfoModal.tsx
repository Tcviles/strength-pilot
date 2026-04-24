import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useTheme } from '../../hooks/useTheme';
import { exerciseInfoModalStyles } from './ExerciseInfoModal.styles';

export type ExerciseInfoRecord = {
  exerciseId: string;
  name: string;
  equipment: string;
  attachments?: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tips: string[];
  alternatives: Array<{
    exerciseId: string;
    name: string;
    equipment: string;
  }>;
};

type Props = {
  exerciseId: string | null;
  visible: boolean;
  onClose: () => void;
  onAlternativePress?: (exerciseId: string) => void;
  exercise?: ExerciseInfoRecord | null;
  showDelete?: boolean;
  deleteLoading?: boolean;
  onDelete?: (exerciseId: string) => void;
};

const DIAGRAMS: Record<string, any> = {
  bb_bench_press: require('../../media/WorkoutThumbnails/BenchPress.png'),
  db_bench_press: require('../../media/WorkoutThumbnails/BenchPress.png'),
  close_grip_bench_press: require('../../media/WorkoutThumbnails/BenchPress.png'),
};

export function ExerciseInfoModal({
  exerciseId,
  visible,
  onClose,
  onAlternativePress,
  exercise,
  showDelete = false,
  deleteLoading = false,
  onDelete,
}: Props) {
  const { palette } = useTheme();

  if (!exerciseId && !exercise) {
    return null;
  }

  const fallbackMeta = getExerciseMeta(exerciseId as string);
  const exerciseMeta: ExerciseInfoRecord = exercise || {
    exerciseId: exerciseId as string,
    name: fallbackMeta.name,
    equipment: fallbackMeta.equipment,
    attachments: [],
    primaryMuscles: fallbackMeta.primaryMuscles,
    secondaryMuscles: fallbackMeta.secondaryMuscles,
    tips: fallbackMeta.tips,
    alternatives: fallbackMeta.alternatives,
  };
  const diagramSource = exerciseId ? (DIAGRAMS[exerciseId] || null) : null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={exerciseInfoModalStyles.modalBackdrop}>
        <View
          style={[
            exerciseInfoModalStyles.modalCard,
            { backgroundColor: palette.card, borderColor: palette.line },
          ]}
        >
          <View style={exerciseInfoModalStyles.modalHeader}>
            <Text style={[exerciseInfoModalStyles.modalTitle, { color: palette.text }]}>
              About {exerciseMeta.name}
            </Text>
            <Pressable
              onPress={onClose}
              style={[
                exerciseInfoModalStyles.modalClose,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[exerciseInfoModalStyles.modalCloseText, { color: palette.text }]}>x</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={exerciseInfoModalStyles.modalScrollContent}
          >
            {diagramSource ? (
              <View
                style={[
                  exerciseInfoModalStyles.diagramCard,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <Image
                  source={diagramSource}
                  style={exerciseInfoModalStyles.diagramImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Target muscles
              </Text>
              <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.text }]}>
                Primary: {exerciseMeta.primaryMuscles.join(', ')}
              </Text>
              <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.muted }]}>
                Secondary: {exerciseMeta.secondaryMuscles.join(', ')}
              </Text>
              {exerciseMeta.attachments?.length ? (
                <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.muted }]}>
                  Attachments: {exerciseMeta.attachments.join(', ')}
                </Text>
              ) : null}
            </View>

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Exercise tips
              </Text>
              {exerciseMeta.tips.map((tip) => (
                <View key={tip} style={exerciseInfoModalStyles.modalListRow}>
                  <Text style={[exerciseInfoModalStyles.modalListBullet, { color: palette.accent }]}>+</Text>
                  <Text
                    style={[
                      exerciseInfoModalStyles.modalParagraph,
                      exerciseInfoModalStyles.modalListText,
                      { color: palette.text },
                    ]}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Alternatives
              </Text>
              {exerciseMeta.alternatives.map((alternative) => (
                <Pressable
                  key={alternative.exerciseId}
                  onPress={() => onAlternativePress?.(alternative.exerciseId)}
                  disabled={!onAlternativePress}
                  style={[
                    exerciseInfoModalStyles.modalAlternativeCard,
                    { backgroundColor: palette.panel, borderColor: palette.line },
                  ]}
                >
                  <Text style={[exerciseInfoModalStyles.modalAlternativeTitle, { color: palette.text }]}>
                    {alternative.name}
                  </Text>
                  <Text style={[exerciseInfoModalStyles.modalAlternativeMeta, { color: palette.muted }]}>
                    {alternative.equipment}
                  </Text>
                </Pressable>
              ))}
            </View>

            {showDelete && exerciseMeta.exerciseId ? (
              <Pressable
                onPress={() => onDelete?.(exerciseMeta.exerciseId)}
                disabled={!onDelete || deleteLoading}
                style={[
                  exerciseInfoModalStyles.modalAlternativeCard,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                  deleteLoading ? exerciseInfoModalStyles.modalDeleteCardLoading : null,
                ]}
              >
                <Text
                  style={[
                    exerciseInfoModalStyles.modalAlternativeTitle,
                    exerciseInfoModalStyles.modalDeleteTitle,
                  ]}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Exercise'}
                </Text>
                <Text style={[exerciseInfoModalStyles.modalAlternativeMeta, { color: palette.muted }]}>
                  Temporary beta cleanup action
                </Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
