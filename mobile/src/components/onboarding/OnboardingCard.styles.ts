import { StyleSheet } from 'react-native';

export const onboardingCardStyles = StyleSheet.create({
  onboardingModal: {
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 18,
  },
  onboardingHero: {
    borderWidth: 1,
    borderRadius: 22,
    paddingLeft: 18,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 118,
    overflow: 'visible',
  },
  onboardingHeroTop: {
    minHeight: 88,
    justifyContent: 'center',
  },
  onboardingHeroCopy: {
    gap: 4,
    minWidth: 0,
    maxWidth: 150,
  },
  onboardingWelcomeEyebrow: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  onboardingWelcomeName: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
    width: "85%"
  },
  onboardingIntro: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: -0.1,
    maxWidth: 150,
  },
  onboardingLogoWrap: {
    position: 'absolute',
    right: -200,
    top: -50,
    width: 188,
    height: 132,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  onboardingLogo: {
    width: 300,
  },
  onboardingStepHeader: {
    gap: 8,
  },
  onboardingStepCount: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  onboardingStepTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  onboardingStepHelper: {
    fontSize: 14,
    lineHeight: 20,
  },
  onboardingFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 6,
  },
  onboardingStatusCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  onboardingStatusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  onboardingErrorText: {
    fontSize: 13,
    lineHeight: 18,
  },
  onboardingTextInput: {
    minHeight: 56,
  },
});
