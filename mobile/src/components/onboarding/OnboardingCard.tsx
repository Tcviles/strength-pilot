import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import type { Experience, Goal, GymType, SplitPreference } from '../../types/app';
import { ActionButton } from '../shared/ActionButton';
import { OptionRow } from '../shared/OptionRow';
import { styles } from '../../theme/styles';

export function OnboardingCard() {
  const { palette } = useTheme();
  const {
    draftProfile: profile,
    draftGym: gym,
    loading,
    status,
    error,
    setDraftProfile: onProfileChange,
    setDraftGym: onGymChange,
    saveOnboarding: onSave,
  } = useAppState();
  const [step, setStep] = useState(0);
  const firstName = profile.firstName?.trim();

  const steps = useMemo(
    () => [
      {
        key: 'first-name',
        label: 'First name',
        title: 'What should we call you?',
        helper: 'We will use this to personalize your plan and keep the app feeling human.',
        type: 'text' as const,
        value: profile.firstName || '',
        placeholder: 'First name',
        onChange: (value: string) => onProfileChange({ ...profile, firstName: value }),
      },
      {
        key: 'goal',
        label: 'Goal',
        title: 'What are you training for?',
        helper: 'We will tune volume, reps, and progression around this.',
        type: 'options' as const,
        options: ['strength', 'hypertrophy', 'fat_loss', 'general'],
        selected: profile.goal,
        onSelect: (value: string) => onProfileChange({ ...profile, goal: value as Goal }),
      },
      {
        key: 'experience',
        label: 'Experience',
        title: 'How experienced are you in the gym?',
        helper: 'This helps us decide how technical and demanding your sessions should be.',
        type: 'options' as const,
        options: ['beginner', 'intermediate', 'advanced'],
        selected: profile.experience,
        onSelect: (value: string) => onProfileChange({ ...profile, experience: value as Experience }),
      },
      {
        key: 'split-preference',
        label: 'Workout style',
        title: 'Do you prefer full body or split workouts?',
        helper: 'Choose what feels best. Auto lets StrengthPilot decide based on your schedule.',
        type: 'options' as const,
        options: ['auto', 'full_body', 'split'],
        selected: profile.splitPreference,
        onSelect: (value: string) => onProfileChange({ ...profile, splitPreference: value as SplitPreference }),
      },
      {
        key: 'days',
        label: 'Days per week',
        title: 'How many days can you realistically train?',
        helper: 'Pick the number you can repeat consistently, not the perfect week.',
        type: 'options' as const,
        options: ['3', '4', '5', '6'],
        selected: String(profile.daysPerWeek),
        onSelect: (value: string) => onProfileChange({ ...profile, daysPerWeek: Number(value) }),
      },
      {
        key: 'session-length',
        label: 'Session length',
        title: 'How long should a normal session take?',
        helper: 'We will build around the time you actually have.',
        type: 'options' as const,
        options: ['30', '45', '60', '90'],
        selected: String(profile.sessionLength),
        onSelect: (value: string) => onProfileChange({ ...profile, sessionLength: Number(value) }),
      },
      {
        key: 'gym-type',
        label: 'Gym type',
        title: 'What kind of gym are you training in most often?',
        helper: 'We will assume a matching equipment setup for your first plan.',
        type: 'options' as const,
        options: ['commercial', 'home', 'hotel'],
        selected: gym.type,
        onSelect: (value: string) => onGymChange({ ...gym, type: value as GymType }),
      },
    ],
    [profile, gym, onProfileChange, onGymChange],
  );

  const currentStep = steps[step];
  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;

  return (
    <View style={[onboardingCardStyles.onboardingModal, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <View style={[onboardingCardStyles.onboardingHero, { backgroundColor: palette.panel, borderColor: palette.line }]}>
        <View style={onboardingCardStyles.onboardingHeroTop}>
          <View style={onboardingCardStyles.onboardingHeroCopy}>
            <Text style={[onboardingCardStyles.onboardingWelcomeEyebrow, { color: palette.text }]}>Welcome,</Text>
            {firstName ? (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.62}
                style={[onboardingCardStyles.onboardingWelcomeName, { color: palette.text }]}
              >
                {firstName}
              </Text>
            ) : null}
            <Text style={[onboardingCardStyles.onboardingIntro, { color: palette.muted }]}>Tell us about you</Text>
          </View>
          <View style={onboardingCardStyles.onboardingLogoWrap}>
            <Image source={require('../../media/LoginLogo.png')} style={onboardingCardStyles.onboardingLogo} resizeMode="contain" />
          </View>
        </View>
      </View>

      <View style={onboardingCardStyles.onboardingStepHeader}>
        <Text style={[onboardingCardStyles.onboardingStepCount, { color: palette.accent }]}>
          Step {step + 1} of {steps.length}
        </Text>
        <Text style={[onboardingCardStyles.onboardingStepTitle, { color: palette.text }]}>{currentStep.title}</Text>
        <Text style={[onboardingCardStyles.onboardingStepHelper, { color: palette.muted }]}>{currentStep.helper}</Text>
      </View>

      {currentStep.type === 'text' ? (
        <View style={styles.optionRow}>
          <Text style={[styles.subheading, { color: palette.text }]}>{currentStep.label}</Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            placeholder={currentStep.placeholder}
            placeholderTextColor={palette.placeholder}
            style={[
              styles.input,
              onboardingCardStyles.onboardingTextInput,
              { color: palette.text, borderColor: palette.line, backgroundColor: palette.input },
            ]}
            value={currentStep.value}
            onChangeText={currentStep.onChange}
          />
        </View>
      ) : (
        <OptionRow label={currentStep.label} options={currentStep.options} selected={currentStep.selected} onSelect={currentStep.onSelect} />
      )}

      {status !== 'Ready' || error ? (
        <View
          style={[
            onboardingCardStyles.onboardingStatusCard,
            { backgroundColor: palette.panel, borderColor: error ? palette.error : palette.line },
          ]}
        >
          <Text style={[onboardingCardStyles.onboardingStatusText, { color: palette.text }]}>
            {error ? 'Save issue' : status}
          </Text>
          {error ? (
            <Text style={[onboardingCardStyles.onboardingErrorText, { color: palette.error }]}>
              {error}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={onboardingCardStyles.onboardingFooter}>
        <ActionButton grow label="Back" disabled={loading || isFirstStep} onPress={() => setStep((value) => Math.max(0, value - 1))} />
        <ActionButton
          grow
          label={isLastStep ? 'Save And Continue' : 'Continue'}
          disabled={loading || (currentStep.type === 'text' && !currentStep.value.trim())}
          onPress={isLastStep ? onSave : () => setStep((value) => Math.min(steps.length - 1, value + 1))}
        />
      </View>
    </View>
  );
}

const onboardingCardStyles = StyleSheet.create({
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
    width: '85%',
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
