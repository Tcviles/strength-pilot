import { StyleSheet } from 'react-native';

export const preferencesButtonStyles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
