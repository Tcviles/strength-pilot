import React from 'react';
import { ImageBackground, Pressable, Text } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function ActionButton({ label, onPress, disabled }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonPressable, disabled ? styles.buttonDisabled : null]}
    >
      <ImageBackground
        source={require('../../media/ButtonBackground.png')}
        resizeMode="cover"
        imageStyle={styles.buttonBackgroundImage}
        style={[
          styles.button,
          {
            backgroundColor: disabled ? palette.buttonDisabled : palette.accent,
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: palette.buttonText }]}>{label}</Text>
      </ImageBackground>
    </Pressable>
  );
}
