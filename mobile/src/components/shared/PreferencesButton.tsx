import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { preferencesButtonStyles } from './PreferencesButton.styles';

type Props = {
  onPress: () => void;
  primary?: boolean;
};

export function PreferencesButton({ onPress, primary = false }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        preferencesButtonStyles.button,
        primary
          ? { backgroundColor: palette.accent, borderColor: palette.accent }
          : { backgroundColor: palette.card, borderColor: palette.line },
      ]}
    >
      <View style={preferencesButtonStyles.iconWrap}>
        <View
          style={[
            preferencesButtonStyles.iconLine,
            { backgroundColor: primary ? '#fff' : palette.text },
          ]}
        >
          <View
            style={[
              preferencesButtonStyles.knob,
              preferencesButtonStyles.knobTop,
              { backgroundColor: primary ? '#fff' : palette.text },
            ]}
          />
        </View>
        <View
          style={[
            preferencesButtonStyles.iconLine,
            { backgroundColor: primary ? '#fff' : palette.text },
          ]}
        >
          <View
            style={[
              preferencesButtonStyles.knob,
              preferencesButtonStyles.knobMiddle,
              { backgroundColor: primary ? '#fff' : palette.text },
            ]}
          />
        </View>
        <View
          style={[
            preferencesButtonStyles.iconLine,
            { backgroundColor: primary ? '#fff' : palette.text },
          ]}
        >
          <View
            style={[
              preferencesButtonStyles.knob,
              preferencesButtonStyles.knobBottom,
              { backgroundColor: primary ? '#fff' : palette.text },
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}
