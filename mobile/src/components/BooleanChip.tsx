import React from 'react';
import { Pressable, Text } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';

type Props = {
  palette: Palette;
  label: string;
  active: boolean;
  onPress: () => void;
};

export function BooleanChip({ palette, label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.booleanChip,
        {
          borderColor: active ? palette.accent : palette.line,
          backgroundColor: active ? palette.badge : palette.input,
        },
      ]}
    >
      <Text style={[styles.toggleLabel, { color: active ? palette.text : palette.muted }]}>{label}</Text>
    </Pressable>
  );
}
