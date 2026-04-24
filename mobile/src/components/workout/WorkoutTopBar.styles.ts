import { StyleSheet } from 'react-native';

export const workoutTopBarStyles = StyleSheet.create({
  barWrap: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  bar: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2,
  },
  navButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.45,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 20,
  },
  timerValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
