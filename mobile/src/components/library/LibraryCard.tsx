import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getExerciseLibraryItems } from '../../constants/exercises';
import { useTheme } from '../../hooks/useTheme';
import { ExerciseInfoModal } from '../shared/ExerciseInfoModal';
import { libraryCardStyles } from './LibraryCard.styles';

export function LibraryCard() {
  const { palette } = useTheme();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const exercises = useMemo(() => getExerciseLibraryItems(), []);

  return (
    <>
      <View
        style={[
          libraryCardStyles.card,
          { backgroundColor: palette.card, borderColor: palette.line },
        ]}
      >
        <View style={libraryCardStyles.header}>
          <Text style={[libraryCardStyles.eyebrow, { color: palette.accent }]}>Library</Text>
          <Text style={[libraryCardStyles.title, { color: palette.text }]}>Exercise reference</Text>
          <Text style={[libraryCardStyles.body, { color: palette.muted }]}>
            Browse the movements in StrengthPilot and tap one to open its detail card.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={libraryCardStyles.list}>
          {exercises.map((exercise) => (
            <Pressable
              key={exercise.exerciseId}
              onPress={() => setSelectedExerciseId(exercise.exerciseId)}
              style={[
                libraryCardStyles.row,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <View style={libraryCardStyles.rowCopy}>
                <Text style={[libraryCardStyles.rowTitle, { color: palette.text }]}>
                  {exercise.name}
                </Text>
                <Text style={[libraryCardStyles.rowMeta, { color: palette.muted }]}>
                  {exercise.equipment} · {exercise.primaryMuscles.join(', ')}
                </Text>
              </View>
              <Text style={[libraryCardStyles.rowChevron, { color: palette.muted }]}>›</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ExerciseInfoModal
        exerciseId={selectedExerciseId}
        visible={Boolean(selectedExerciseId)}
        onClose={() => setSelectedExerciseId(null)}
        onAlternativePress={(exerciseId) => setSelectedExerciseId(exerciseId)}
      />
    </>
  );
}
