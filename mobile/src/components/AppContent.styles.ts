import { StyleSheet } from 'react-native';

export const appContentStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  stageScroll: {
    backgroundColor: 'transparent',
  },
  authScrollContent: {
    justifyContent: 'center',
    minHeight: '100%',
    paddingVertical: 12,
  },
  onboardingScrollContent: {
    justifyContent: 'center',
    minHeight: '100%',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  backgroundWrap: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  authBackgroundImage: {
    opacity: 0.88,
    transform: [{ scale: 1.18 }],
  },
  authBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.38,
  },
  onboardingBackgroundImage: {
    opacity: 0.84,
    transform: [{ scale: 1.24 }, { translateX: 40 }, { translateY: -36 }],
  },
  onboardingBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  appBackgroundImage: {
    opacity: 0.8,
    transform: [{ scale: 1.22 }, { translateX: -42 }, { translateY: 52 }],
  },
  appBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.58,
  },
  shell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 16,
  },
  authShell: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 10,
    gap: 20,
  },
  onboardingShell: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 0,
  },
  authShellTransparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  hero: {
    gap: 14,
  },
  authHero: {
    alignItems: 'center',
    paddingTop: 12,
    gap: 2,
  },
  authLogo: {
    width: 290,
    height: 185,
  },
  authWordmark: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  authTagline: {
    fontSize: 14,
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
  authStatusCard: {
    marginHorizontal: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  loadingRow: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});
