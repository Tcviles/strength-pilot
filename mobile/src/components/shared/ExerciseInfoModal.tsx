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

type Props = {
  exerciseId: string | null;
  visible: boolean;
  onClose: () => void;
  onAlternativePress?: (exerciseId: string) => void;
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
}: Props) {
  const { palette } = useTheme();

  if (!exerciseId) {
    return null;
  }

  const exerciseMeta = getExerciseMeta(exerciseId);
  const diagramSource = DIAGRAMS[exerciseId] || null;

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
            </View>

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Exercise tips
              </Text>
              {exerciseMeta.tips.map((tip) => (
                <View key={tip} style={exerciseInfoModalStyles.modalListRow}>
                  <Text style={[exerciseInfoModalStyles.modalListBullet, { color: palette.accent }]}>+</Text>
                  <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.text }]}>{tip}</Text>
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
