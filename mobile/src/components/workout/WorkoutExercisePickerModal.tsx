import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { fetchExerciseLibraryVariants, type ExerciseLibraryVariant } from '../../services/exerciseLibrary';

type WorkoutExercisePickerModalProps = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
};

export function WorkoutExercisePickerModal({
  visible,
  title = 'Add Exercise',
  onClose,
  onSelect,
}: WorkoutExercisePickerModalProps) {
  const { palette } = useTheme();
  const [search, setSearch] = useState('');
  const [exerciseChoices, setExerciseChoices] = useState<ExerciseLibraryVariant[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchExerciseLibraryVariants()
      .then((items) => {
        if (!cancelled) {
          setExerciseChoices(items);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredChoices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exerciseChoices.filter((exercise) => {
      if (!query) {
        return true;
      }

      return (
        exercise.displayName.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query) ||
        exercise.primaryMuscles.join(' ').toLowerCase().includes(query)
      );
    });
  }, [exerciseChoices, search]);

  const closeAndReset = () => {
    setSearch('');
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={closeAndReset}>
      <View style={workoutExercisePickerStyles.modalBackdrop}>
        <View
          style={[
            workoutExercisePickerStyles.addModalCard,
            { backgroundColor: palette.card, borderColor: palette.line },
          ]}
        >
          <View style={workoutExercisePickerStyles.header}>
            <View style={workoutExercisePickerStyles.headerCopy}>
              <Text style={[workoutExercisePickerStyles.title, { color: palette.text }]}>
                {title}
              </Text>
            </View>
            <Pressable
              onPress={closeAndReset}
              style={[
                workoutExercisePickerStyles.closeButton,
                { backgroundColor: palette.panel, borderColor: palette.line },
              ]}
            >
              <Text style={[workoutExercisePickerStyles.closeButtonText, { color: palette.text }]}>×</Text>
            </Pressable>
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises"
            placeholderTextColor={palette.placeholder}
            style={[
              workoutExercisePickerStyles.searchInput,
              { backgroundColor: palette.panel, borderColor: palette.line, color: palette.text },
            ]}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            persistentScrollbar={false}
            contentContainerStyle={workoutExercisePickerStyles.listContent}
          >
            {filteredChoices.map((exercise) => (
              <Pressable
                key={exercise.exerciseId}
                onPress={() => {
                  onSelect(exercise.exerciseId);
                  closeAndReset();
                }}
                style={[
                  workoutExercisePickerStyles.choiceRow,
                  { backgroundColor: palette.panel, borderColor: palette.line },
                ]}
              >
                <View style={workoutExercisePickerStyles.choiceCopy}>
                  <Text style={[workoutExercisePickerStyles.choiceTitle, { color: palette.text }]}>
                    {exercise.displayName}
                  </Text>
                  <Text style={[workoutExercisePickerStyles.choiceMeta, { color: palette.muted }]}>
                    {exercise.equipment}
                  </Text>
                </View>
                <View
                  style={[
                    workoutExercisePickerStyles.choiceButton,
                    { backgroundColor: palette.card, borderColor: palette.line },
                  ]}
                >
                  <Text style={[workoutExercisePickerStyles.choiceButtonText, { color: palette.accent }]}>+</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const workoutExercisePickerStyles = StyleSheet.create({
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
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.7,
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
  searchInput: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  listContent: {
    gap: 8,
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
});
