import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { WorkoutTemplateEditor } from './WorkoutTemplateEditor';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function WorkoutMenuModal({ visible, onClose }: Props) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={workoutMenuModalStyles.backdrop}>
        <Pressable style={workoutMenuModalStyles.backdropTap} onPress={onClose} />
        <WorkoutTemplateEditor
          variant="workout"
          title="Workout Plan"
          subtitle="Swipe left to remove an exercise, or tap a row to jump to it."
          onClose={onClose}
        />
      </View>
    </Modal>
  );
}

const workoutMenuModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 12, 0.72)',
    justifyContent: 'flex-start',
    paddingTop: 118,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  backdropTap: {
    ...StyleSheet.absoluteFill,
  },
});
