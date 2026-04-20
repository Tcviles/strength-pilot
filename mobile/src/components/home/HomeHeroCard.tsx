import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { homeHeroCardStyles } from './HomeHeroCard.styles';

type Props = {
  dayHeading: string;
  timerText: string;
  firstName: string;
  workoutStartedAt: string | null;
  workoutTitle: string;
  focusLabel: string;
  sessionLength: number;
  loading: boolean;
  onOpenPreferences: () => void;
  onStartWorkout: () => void;
};

export function HomeHeroCard({
  dayHeading,
  timerText,
  firstName,
  workoutStartedAt,
  workoutTitle,
  focusLabel,
  sessionLength,
  loading,
  onOpenPreferences,
  onStartWorkout,
}: Props) {
  const { palette } = useTheme();

  return (
    <>
      <View style={homeHeroCardStyles.homeHeaderRow}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          style={[homeHeroCardStyles.homeHeaderTitle, { color: palette.text }]}
        >
          {dayHeading}
        </Text>
        {timerText ? (
          <View style={[homeHeroCardStyles.homeTimerChip, { backgroundColor: palette.panel, borderColor: palette.line }]}>
            <Text style={[homeHeroCardStyles.homeTimerText, { color: palette.text }]}>{timerText}</Text>
          </View>
        ) : (
          <View style={homeHeroCardStyles.homeTimerPlaceholder} />
        )}
        <Pressable onPress={onOpenPreferences} style={homeHeroCardStyles.homeHeaderActions}>
          <Text style={[homeHeroCardStyles.homeHeaderDots, { color: palette.muted }]}>...</Text>
        </Pressable>
      </View>

      <View style={[homeHeroCardStyles.homeHero, { backgroundColor: palette.card, borderColor: palette.line }]}>
        <View style={homeHeroCardStyles.homeHeroBannerTop}>
          <View style={homeHeroCardStyles.homeHeroCopy}>
            <Text style={[homeHeroCardStyles.homeHeroEyebrow, { color: palette.text }]}>Welcome back,</Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.62}
              style={[homeHeroCardStyles.homeHeroName, { color: palette.text }]}
            >
              {firstName}
            </Text>
          </View>
          <View style={homeHeroCardStyles.homeHeroLogoWrap}>
            <Image source={require('../../media/LoginLogo.png')} style={homeHeroCardStyles.homeHeroLogo} resizeMode="contain" />
          </View>
        </View>

        <View style={[homeHeroCardStyles.homeRecommendedCard, { backgroundColor: palette.panel, borderColor: palette.line }]}>
          <Text style={[homeHeroCardStyles.homeRecommendedEyebrow, { color: palette.text }]}>
            {workoutStartedAt ? 'Workout In Progress' : 'Todays Recommended Workout'}
          </Text>
          <View style={homeHeroCardStyles.homeRecommendedRow}>
            <View style={homeHeroCardStyles.homeRecommendedCopy}>
              <Text style={[homeHeroCardStyles.homeRecommendedTitle, { color: palette.text }]}>{workoutTitle}</Text>
              <Text style={[homeHeroCardStyles.homeRecommendedMeta, { color: palette.muted }]}>
                Focus: {focusLabel}
              </Text>
            </View>
            <View style={[homeHeroCardStyles.homeDurationChip, { borderColor: palette.line, backgroundColor: palette.card }]}>
              <Text style={[homeHeroCardStyles.homeDurationText, { color: palette.text }]}>
                Duration {sessionLength} min
              </Text>
            </View>
          </View>
          <View style={homeHeroCardStyles.homeRecoveryRow}>
            <Text style={[homeHeroCardStyles.homeRecoveryIcon, homeHeroCardStyles.homeRecoveryIconSuccess]}>↻</Text>
            <Text style={homeHeroCardStyles.homeRecoveryText}>Recovered 87%</Text>
          </View>
          <ActionButton
            label={loading ? 'Building...' : workoutStartedAt ? 'Continue Workout' : 'Start Workout'}
            disabled={loading}
            onPress={onStartWorkout}
          />
        </View>
      </View>
    </>
  );
}
