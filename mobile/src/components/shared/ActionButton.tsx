import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  grow?: boolean;
};

export function ActionButton({ label, onPress, disabled, grow = false }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        grow ? styles.buttonPressableGrow : styles.buttonPressable,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <View
        style={[
          grow ? styles.buttonGrow : styles.button,
          {
            backgroundColor: disabled ? palette.buttonDisabled : palette.accent,
          },
        ]}
      >
        {!disabled ? (
          <ImageBackground
            source={require('../../media/ButtonBackground.png')}
            resizeMode="cover"
            imageStyle={styles.buttonTextureImage}
            style={styles.buttonTexture}
          />
        ) : null}
        <Text style={[styles.buttonText, { color: palette.buttonText }]}>{label}</Text>
      </View>
    </Pressable>
  );
}
