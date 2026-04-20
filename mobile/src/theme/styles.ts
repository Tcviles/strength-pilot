import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  authCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    gap: 14,
    marginHorizontal: 8,
  },
  sectionHeading: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputRow: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  eyeButton: {
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  eyeButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  authHelperLink: {
    alignItems: 'center',
    marginTop: -2,
  },
  authHelperText: {
    fontSize: 14,
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionRow: {
    gap: 8,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '700',
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  dualRow: {
    flexDirection: 'row',
    gap: 10,
  },
  booleanChip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 6,
  },
  metricLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  workoutBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  workoutBannerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseMeta: {
    fontSize: 13,
  },
});
