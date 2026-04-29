import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getExerciseMeta } from '../../constants/exercises';
import { useTheme } from '../../hooks/useTheme';

export type ExerciseInfoRecord = {
  exerciseId: string;
  name: string;
  displayName?: string;
  familyId?: string;
  familyName?: string;
  variantLabel?: string;
  equipment: string;
  attachments?: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tips: string[];
  variants?: Array<{
    exerciseId: string;
    name: string;
    displayName?: string;
    familyId?: string;
    familyName?: string;
    variantLabel?: string;
    equipment: string;
    attachments?: string[];
    primaryMuscles: string[];
    secondaryMuscles: string[];
    tips: string[];
    alternatives: Array<{
      exerciseId: string;
      name: string;
      displayName?: string;
      equipment: string;
    }>;
  }>;
  alternatives: Array<{
    exerciseId: string;
    name: string;
    displayName?: string;
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
  onVariantPress?: (exerciseId: string) => void;
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
  onVariantPress,
}: Props) {
  const { palette } = useTheme();
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(exerciseId);

  React.useEffect(() => {
    setSelectedVariantId(exerciseId);
  }, [exerciseId]);

  if (!exerciseId && !exercise) {
    return null;
  }

  const fallbackMeta = getExerciseMeta(exerciseId as string);
  const exerciseMeta: ExerciseInfoRecord = exercise || {
    exerciseId: exerciseId as string,
    name: fallbackMeta.name,
    displayName: fallbackMeta.displayName,
    familyId: fallbackMeta.familyId,
    familyName: fallbackMeta.familyName,
    variantLabel: fallbackMeta.variantLabel,
    equipment: fallbackMeta.equipment,
    attachments: [],
    primaryMuscles: fallbackMeta.primaryMuscles,
    secondaryMuscles: fallbackMeta.secondaryMuscles,
    tips: fallbackMeta.tips,
    variants: fallbackMeta.variants,
    alternatives: fallbackMeta.alternatives,
  };
  const availableVariants = exerciseMeta.variants?.length ? exerciseMeta.variants : [exerciseMeta];
  const currentVariant = availableVariants.find((variant) => variant.exerciseId === selectedVariantId) || availableVariants[0];
  const currentExerciseId = currentVariant.exerciseId;
  const diagramSource = currentExerciseId ? (DIAGRAMS[currentExerciseId] || null) : null;

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
              About {exerciseMeta.familyName || currentVariant.name}
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
            overScrollMode="never"
            persistentScrollbar={false}
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

            {availableVariants.length > 1 ? (
              <View style={exerciseInfoModalStyles.modalSection}>
                <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                  Type
                </Text>
                <View style={exerciseInfoModalStyles.variantRow}>
                  {availableVariants.map((variant) => {
                    const active = variant.exerciseId === currentVariant.exerciseId;
                    return (
                      <Pressable
                        key={variant.exerciseId}
                        onPress={() => {
                          if (onVariantPress) {
                            onVariantPress(variant.exerciseId);
                            return;
                          }
                          setSelectedVariantId(variant.exerciseId);
                        }}
                        style={[
                          exerciseInfoModalStyles.variantButton,
                          {
                            backgroundColor: active ? palette.accent : palette.panel,
                            borderColor: active ? palette.accent : palette.line,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            exerciseInfoModalStyles.variantButtonText,
                            { color: active ? palette.buttonText : palette.text },
                          ]}
                        >
                          {variant.variantLabel || variant.equipment}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Target muscles
              </Text>
              <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.text }]}>
                Primary: {currentVariant.primaryMuscles.join(', ')}
              </Text>
              <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.muted }]}>
                Secondary: {currentVariant.secondaryMuscles.join(', ')}
              </Text>
              {currentVariant.attachments?.length ? (
                <Text style={[exerciseInfoModalStyles.modalParagraph, { color: palette.muted }]}>
                  Attachments: {currentVariant.attachments.join(', ')}
                </Text>
              ) : null}
            </View>

            <View style={exerciseInfoModalStyles.modalSection}>
              <Text style={[exerciseInfoModalStyles.modalSectionLabel, { color: palette.accent }]}>
                Exercise tips
              </Text>
              {currentVariant.tips.map((tip) => (
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
              {currentVariant.alternatives.map((alternative) => (
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
                    {alternative.displayName || alternative.name}
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

const exerciseInfoModalStyles = StyleSheet.create({
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    flex: 1,
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
  modalScrollContent: {
    gap: 12,
    paddingBottom: 8,
  },
  diagramCard: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  diagramImage: {
    width: '100%',
    height: 220,
  },
  modalSection: {
    gap: 8,
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  variantButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  modalParagraph: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  modalListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
  },
  modalListBullet: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
    width: 12,
  },
  modalListText: {
    flex: 1,
    flexShrink: 1,
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
  modalDeleteCardLoading: {
    opacity: 0.6,
  },
  modalDeleteTitle: {
    color: '#ff7a6f',
  },
});
