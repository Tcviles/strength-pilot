import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { chrome } from '../../theme/styles';
import { ExerciseCard } from './ExerciseCard';

const MINI_LOGO = require('../../media/MiniLogo.png');

export function WorkoutCard() {
  const { palette } = useTheme();

  return (
    <View style={workoutCardStyles.screen}>
      <ExerciseCard />

      <View
        style={[
          workoutCardStyles.promoCard,
          { backgroundColor: palette.card, borderColor: palette.line },
        ]}
      >
        <View style={workoutCardStyles.promoLeft}>
          <Image source={MINI_LOGO} style={workoutCardStyles.promoLogo} resizeMode="contain" />
          <View style={workoutCardStyles.promoCopy}>
            <Text style={[workoutCardStyles.promoTitle, { color: palette.text }]}>
              Build stronger. Every day.
            </Text>
            <Text style={[workoutCardStyles.promoBody, { color: palette.muted }]}>
              Find the right movement. Train smarter.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const workoutCardStyles = StyleSheet.create({
  screen: {
    gap: chrome.compactGap,
  },
  promoCard: {
    borderWidth: 1,
    borderRadius: chrome.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoLogo: {
    width: 40,
    height: 40,
  },
  promoCopy: {
    gap: 2,
    flex: 1,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  promoBody: {
    fontSize: chrome.metaFontSize,
    lineHeight: 16,
    fontWeight: '500',
    opacity: chrome.metaOpacity,
  },
});
