import React from 'react';
import { Pressable, Text } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';

type Props = {
  palette: Palette;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function ActionButton({ palette, label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? palette.buttonDisabled : palette.accent,
        },
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <Text style={[styles.buttonText, { color: palette.buttonText }]}>{label}</Text>
    </Pressable>
  );
}
