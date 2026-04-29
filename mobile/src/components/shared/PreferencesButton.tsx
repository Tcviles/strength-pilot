import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

type Props = {
  onPress: () => void;
  primary?: boolean;
  compact?: boolean;
};

export function PreferencesButton({ onPress, primary = false, compact = false }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        preferencesButtonStyles.button,
        compact ? preferencesButtonStyles.buttonCompact : null,
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

const preferencesButtonStyles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  iconWrap: {
    width: 22,
    gap: 4,
  },
  iconLine: {
    height: 2,
    borderRadius: 999,
    position: 'relative',
  },
  knob: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: -2,
  },
  knobTop: {
    right: 2,
  },
  knobMiddle: {
    left: 7,
  },
  knobBottom: {
    right: 8,
  },
});
