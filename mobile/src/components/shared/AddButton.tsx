import React from 'react';
import { Pressable, Text } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { addButtonStyles } from './AddButton.styles';

type Props = {
  onPress: () => void;
};

export function AddButton({ onPress }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        addButtonStyles.button,
        { backgroundColor: palette.card, borderColor: palette.line },
      ]}
    >
      <Text style={[addButtonStyles.plus, { color: palette.accent }]}>+</Text>
    </Pressable>
  );
}
