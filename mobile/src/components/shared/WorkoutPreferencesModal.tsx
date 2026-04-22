import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import type { Crowd, Gym, Profile } from '../../types/app';
import { ActionButton } from './ActionButton';
import { OptionRow } from './OptionRow';
import { workoutPreferencesModalStyles } from './WorkoutPreferencesModal.styles';

type Props = {
  visible: boolean;
  loading: boolean;
  draftProfile: Profile;
  draftGym: Gym;
  crowd: Crowd;
  mood: string;
  onClose: () => void;
  onSave: () => void;
  setDraftProfile: (value: Profile) => void;
  setDraftGym: (value: Gym) => void;
  setCrowd: (value: Crowd) => void;
  setMood: (value: string) => void;
};

export function WorkoutPreferencesModal({
  visible,
  loading,
  draftProfile,
  draftGym,
  crowd,
  mood,
  onClose,
  onSave,
  setDraftProfile,
  setDraftGym,
  setCrowd,
  setMood,
}: Props) {
  const { palette } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={workoutPreferencesModalStyles.modalBackdrop}>
        <Pressable style={workoutPreferencesModalStyles.modalScrim} onPress={onClose} />
        <View style={[workoutPreferencesModalStyles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
          <View style={workoutPreferencesModalStyles.header}>
            <Text style={[workoutPreferencesModalStyles.title, { color: palette.text }]}>Workout Preferences</Text>
            <Pressable onPress={onClose} style={workoutPreferencesModalStyles.closeButton}>
              <Text style={[workoutPreferencesModalStyles.closeText, { color: palette.muted }]}>×</Text>
            </Pressable>
          </View>

          <OptionRow
            label="Goal"
            options={['strength', 'hypertrophy', 'fat_loss']}
            selected={draftProfile.goal}
            onSelect={(value) => setDraftProfile({ ...draftProfile, goal: value as typeof draftProfile.goal })}
            columns={3}
          />
          <OptionRow
            label="Experience level"
            options={['beginner', 'intermediate', 'advanced']}
            selected={draftProfile.experience}
            onSelect={(value) => setDraftProfile({ ...draftProfile, experience: value as typeof draftProfile.experience })}
            columns={3}
          />
          <OptionRow
            label="Session length"
            options={['30', '45', '60', '90']}
            selected={String(draftProfile.sessionLength)}
            onSelect={(value) => setDraftProfile({ ...draftProfile, sessionLength: Number(value) })}
            columns={4}
          />
          <OptionRow
            label="Training split focus"
            options={['auto', 'full_body', 'split']}
            selected={draftProfile.splitPreference}
            onSelect={(value) => setDraftProfile({ ...draftProfile, splitPreference: value as typeof draftProfile.splitPreference })}
            columns={3}
          />
          <OptionRow
            label="Gym type"
            options={['commercial', 'home', 'hotel']}
            selected={draftGym.type}
            onSelect={(value) => setDraftGym({ ...draftGym, type: value as typeof draftGym.type })}
            columns={3}
          />
          <OptionRow
            label="Crowd"
            options={['low', 'medium', 'high']}
            selected={crowd}
            onSelect={(value) => setCrowd(value as Crowd)}
            columns={3}
          />
          <OptionRow
            label="Readiness"
            options={['Ready', 'Sore', 'Low energy']}
            selected={mood}
            onSelect={setMood}
            columns={3}
          />

          <ActionButton label={loading ? 'Saving...' : 'Save Preferences'} disabled={loading} onPress={onSave} />
        </View>
      </View>
    </Modal>
  );
}
