import { StyleSheet } from 'react-native';

export const homeHeroCardStyles = StyleSheet.create({
  homeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  homeHeaderTitle: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  homeTimerChip: {
    borderWidth: 1,
    borderRadius: 999,
    minWidth: 74,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTimerText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  homeTimerPlaceholder: {
    width: 74,
  },
  homeHeaderActions: {
    width: 52,
    height: 52,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  homeHeaderDots: {
    fontSize: 24,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  homeHero: {
    borderWidth: 1,
    borderRadius: 24,
  },
  homeHeroBannerTop: {
    minHeight: 84,
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  homeHeroCopy: {
    gap: 4,
    minWidth: 0,
    maxWidth: 150,
  },
  homeHeroEyebrow: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  homeHeroName: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  homeHeroLogoWrap: {
    position: 'absolute',
    right: -40,
    top: -25,
    width: 170,
    height: 110,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  homeHeroLogo: {
    width: 200,
    height: 120,
  },
  homeRecommendedCard: {
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 16,
    gap: 10,
  },
  homeRecommendedEyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  homeRecommendedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  homeRecommendedCopy: {
    flex: 1,
    gap: 6,
  },
  homeRecommendedTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  homeRecommendedMeta: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  homeDurationChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  homeDurationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  homeRecoveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeRecoveryIcon: {
    fontSize: 15,
    fontWeight: '700',
  },
  homeRecoveryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8FD78B',
  },
  homeRecoveryIconSuccess: {
    color: '#78C67D',
  },
});
