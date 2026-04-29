import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';

type Props = {
  visible: boolean;
  loading: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (payload: { name: string; equipment: string; notes?: string }) => void;
};

const EQUIPMENT_OPTIONS = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'cardio',
  'bodyweight',
  'smith',
] as const;

export function AddExerciseModal({ visible, loading, error, onClose, onSubmit }: Props) {
  const { palette } = useTheme();
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState<(typeof EQUIPMENT_OPTIONS)[number]>('machine');
  const [notes, setNotes] = useState('');

  const canSubmit = useMemo(() => name.trim().length > 1 && !loading, [loading, name]);

  const submit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit({
      name: name.trim(),
      equipment,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={addExerciseModalStyles.backdrop}>
        <View
          style={[
            addExerciseModalStyles.card,
            { backgroundColor: palette.card, borderColor: palette.line },
          ]}
        >
          <View style={addExerciseModalStyles.header}>
            <Text style={[addExerciseModalStyles.title, { color: palette.text }]}>Add Exercise</Text>
            <Pressable onPress={onClose} style={addExerciseModalStyles.closeButton}>
              <Text style={[addExerciseModalStyles.closeText, { color: palette.muted }]}>×</Text>
            </Pressable>
          </View>

          <Text style={[addExerciseModalStyles.label, { color: palette.accent }]}>Exercise Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Neutral Grip Pulldown"
            placeholderTextColor={palette.placeholder}
            style={[
              addExerciseModalStyles.input,
              { backgroundColor: palette.input, borderColor: palette.line, color: palette.text },
            ]}
          />

          <Text style={[addExerciseModalStyles.label, { color: palette.accent }]}>Equipment</Text>
          <View style={addExerciseModalStyles.optionGrid}>
            {EQUIPMENT_OPTIONS.map((option) => {
              const selected = equipment === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setEquipment(option)}
                  style={[
                    addExerciseModalStyles.optionChip,
                    {
                      backgroundColor: selected ? palette.accentSoft : palette.panel,
                      borderColor: selected ? palette.accent : palette.line,
                    },
                  ]}
                >
                  <Text
                    style={[
                      addExerciseModalStyles.optionChipText,
                      { color: selected ? palette.text : palette.muted },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[addExerciseModalStyles.label, { color: palette.accent }]}>Attachments / Notes (Optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. rope attachment, neutral grip, plate-loaded machine"
            placeholderTextColor={palette.placeholder}
            style={[
              addExerciseModalStyles.input,
              { backgroundColor: palette.input, borderColor: palette.line, color: palette.text },
            ]}
          />

          <Text style={[addExerciseModalStyles.helper, { color: palette.muted }]}>
            We’ll canonicalize the movement with OpenAI, validate the record, and store it in the exercise library.
          </Text>

          {error ? (
            <Text style={[addExerciseModalStyles.error, { color: palette.error }]}>{error}</Text>
          ) : null}

          <ActionButton
            label={loading ? 'Adding Exercise...' : 'Add Exercise'}
            disabled={!canSubmit}
            onPress={submit}
          />
        </View>
      </View>
    </Modal>
  );
}

const addExerciseModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 10, 0.78)',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 28,
    lineHeight: 28,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontWeight: '600',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    minWidth: '30%',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  helper: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
});
