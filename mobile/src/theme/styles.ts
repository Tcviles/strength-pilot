import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  shell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 16,
  },
  hero: {
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  badge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  wordmark: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize: 14,
  },
  missionStrip: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  missionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  missionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
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
  button: {
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
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
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
  loadingRow: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});
